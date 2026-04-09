import { db } from '@/db';
import { meetings, agents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { streamVideo } from '@/lib/stream-video';

// In-memory session store
const activeSessions = new Map<string, any>();

export const autoConnectAgent = async (
  meetingId: string,
  req: Request,
  res: Response
) => {
  try {
    // Check if already connected or connecting
    if (activeSessions.has(meetingId)) {
      return res.json({ success: true, alreadyConnected: true });
    }

    // Immediately mark as connecting to prevent race conditions
    activeSessions.set(meetingId, 'connecting');

    // Fetch meeting + agent data from DB
    const meetingData = await db
      .select({
        meeting: meetings,
        agent: agents,
      })
      .from(meetings)
      .leftJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.id, meetingId))
      .limit(1);

    if (!meetingData || meetingData.length === 0) {
      activeSessions.delete(meetingId);
      return res
        .status(404)
        .json({ success: false, message: 'Meeting not found' });
    }

    const { meeting, agent } = meetingData[0];

    if (!meeting || !agent) {
      activeSessions.delete(meetingId);
      return res
        .status(404)
        .json({ success: false, message: 'No agent found for this meeting' });
    }

    const agentInstructions =
      agent.instructions || 'You are a helpful AI assistant.';

    // Use the official Stream SDK method — exactly matching the docs:
    // https://getstream.io/video/docs/api/ai/openai/
    const call = streamVideo.video.call('default', meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: agent.id,
      model: 'gpt-4o-realtime-preview',
    });

    // Update session with our instructions + config AFTER connection
    // (this is the pattern shown in the Stream docs)
    await realtimeClient.updateSession({
      instructions: agentInstructions,
      voice: 'alloy',
      turn_detection: {
        type: 'server_vad',
        threshold: 0.6,
        prefix_padding_ms: 500,
        silence_duration_ms: 800, // 1 second of silence before continuing
      },
      input_audio_transcription: {
        model: 'whisper-1',
      },
    });

    // Send an initial text prompt to kick off the conversation
    // in the correct persona. This forces the model to generate
    // its first response using the instructions we just set.
    realtimeClient.sendUserMessageContent([
      {
        type: 'input_text',
        text: 'Greet the user according to your instructions and persona. Start the conversation.',
      },
    ]);

    // Event listeners
    realtimeClient.on('error', (error: any) => {
      console.error(`[AI Agent] Error (meeting ${meetingId}):`, error);
      activeSessions.delete(meetingId);
    });

    realtimeClient.on('call.ended', () => {
      console.log(`[AI Agent] Call ended for meeting ${meetingId}`);
      realtimeClient.disconnect();
      activeSessions.delete(meetingId);
    });

    realtimeClient.on('call.session_participant_left', (event: any) => {
      const humanParticipants = event.participants?.filter(
        (p: any) => !p.user_id.startsWith('ai-')
      );

      if (humanParticipants?.length === 0) {
        console.log(
          `[AI Agent] No human participants remaining in meeting ${meetingId}, disconnecting`
        );
        realtimeClient.disconnect();
        activeSessions.delete(meetingId);

        db.update(meetings)
          .set({ status: 'completed', endedAt: new Date() })
          .where(eq(meetings.id, meetingId))
          .catch(console.error);
      }
    });

    // Store the connected client
    activeSessions.set(meetingId, realtimeClient);

    await db
      .update(meetings)
      .set({
        status: 'active',
        startedAt: new Date(),
      })
      .where(eq(meetings.id, meetingId));

    console.log(
      `[AI Agent] Connected agent "${agent.name}" to meeting ${meetingId}`
    );
    return res.json({ success: true, agentId: agent.id });
  } catch (error: any) {
    console.error('[AI Agent] Error in autoConnectAgent:', error);
    activeSessions.delete(meetingId);
    return res.status(500).json({ message: 'Failed to auto connect agent' });
  }
};

export const disconnectAIAgent = async (
  meetingId: string,
  req: Request,
  res: Response
) => {
  try {
    const session = activeSessions.get(meetingId);
    if (session && session !== 'connecting') {
      session.disconnect();
      activeSessions.delete(meetingId);

      // Update meeting status
      await db
        .update(meetings)
        .set({ status: 'completed', endedAt: new Date() })
        .where(eq(meetings.id, meetingId));

      console.log(`[AI Agent] Disconnected agent from meeting ${meetingId}`);
      return res.json({ success: true, message: 'AI agent disconnected' });
    }

    return res.json({
      success: true,
      message: 'No active agent session found',
    });
  } catch (error) {
    console.error('[AI Agent] Error disconnecting:', error);
    return res.status(500).json({ error: 'Failed to disconnect AI agent' });
  }
};

export const getAgentStatus = async (
  meetingId: string,
  req: Request,
  res: Response
) => {
  try {
    const session = activeSessions.get(meetingId);

    if (!session) {
      return res.json({ connected: false, status: 'disconnected' });
    }

    if (session === 'connecting') {
      return res.json({ connected: false, status: 'connecting' });
    }

    return res.json({
      connected: true,
      status: 'connected',
    });
  } catch (error) {
    console.error('[AI Agent] Error getting status:', error);
    return res.status(500).json({ error: 'Failed to get agent status' });
  }
};

/**
 * Disconnect all active agent sessions. Called during graceful server shutdown.
 */
export const disconnectAllSessions = () => {
  console.log(
    `[AI Agent] Shutting down: disconnecting ${activeSessions.size} active session(s)`
  );
  for (const [meetingId, session] of activeSessions.entries()) {
    if (session && session !== 'connecting') {
      try {
        session.disconnect();
      } catch (error) {
        console.error(
          `[AI Agent] Error disconnecting session for meeting ${meetingId}:`,
          error
        );
      }
    }
  }
  activeSessions.clear();
};
