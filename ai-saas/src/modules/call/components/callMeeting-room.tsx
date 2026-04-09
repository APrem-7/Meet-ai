'use client';
import { useRouter, useParams } from 'next/navigation';
import { useCallStateHooks, CallingState } from '@stream-io/video-react-sdk';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCallContext } from '../providers/call-provider';
import { LoadingState } from '@/components/loading-state';
import { MeetingLayout } from './MeetingLayout';
import {
  connectAgent,
  disconnectAgent,
} from '@/app/api/agents/meetings';

export const MeetingRoom = () => {
  const router = useRouter();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const { leaveCall } = useCallContext();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Guards to prevent StrictMode double-connect
  const hasAttemptedConnect = useRef(false);
  // Tracks whether the agent is currently connected (set by both auto-connect and manual toggle)
  const agentConnectedRef = useRef(false);

  // Disconnect agent helper — fire-and-forget, safe to call multiple times
  const disconnectAgentSafe = useCallback(
    async (id: string) => {
      if (!agentConnectedRef.current) return;
      try {
        await disconnectAgent(id);
      } catch (error) {
        console.error('Failed to disconnect AI agent:', error);
      } finally {
        setAgentConnected(false);
        agentConnectedRef.current = false;
        hasAttemptedConnect.current = false;
      }
    },
    []
  );

  // Auto-connect AI agent + cleanup on unmount (single effect to avoid StrictMode issues)
  useEffect(() => {
    if (hasAttemptedConnect.current) return;
    if (callingState !== CallingState.JOINED || !meetingId) return;

    // Set guard BEFORE the async call to prevent StrictMode double-fire
    hasAttemptedConnect.current = true;

    let cancelled = false;

    const doConnect = async () => {
      try {
        await connectAgent(meetingId);
        if (!cancelled) {
          setAgentConnected(true);
          agentConnectedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to auto-connect AI agent:', error);
        if (!cancelled) {
          hasAttemptedConnect.current = false;
        }
      }
    };

    doConnect();

    // Cleanup: only disconnect if the agent is actually connected.
    // In StrictMode, the first render's cleanup fires before connectAgent
    // resolves, so agentConnectedRef.current will still be false — no disconnect.
    return () => {
      cancelled = true;
      if (agentConnectedRef.current && meetingId) {
        disconnectAgent(meetingId).catch(() => {});
        agentConnectedRef.current = false;
        hasAttemptedConnect.current = false;
      }
    };
  }, [callingState, meetingId]);

  const handleLeave = () => setIsDialogOpen(true);
  const handleConfirmLeave = async () => {
    // Disconnect the AI agent before leaving
    if (meetingId && agentConnected) {
      await disconnectAgentSafe(meetingId);
    }
    leaveCall();
    router.push(`/meetings/${meetingId}`);
  };

  if (callingState !== CallingState.JOINED) {
    if (callingState === CallingState.LEFT) {
      router.push(`/meetings/${meetingId}`);
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#202124] text-white">
          <p>Call ended.</p>
        </div>
      );
    }

    return (
      <LoadingState
        title="Loading Call"
        description="Please wait while we join the call"
      />
    );
  }

  return (
    <>
      <MeetingLayout
        meetingId={meetingId}
        onLeave={handleLeave}
        agentConnected={agentConnected}
        onAgentToggle={async () => {
          if (agentConnected) {
            await disconnectAgentSafe(meetingId);
          } else {
            try {
              await connectAgent(meetingId);
              setAgentConnected(true);
              agentConnectedRef.current = true;
              hasAttemptedConnect.current = true;
            } catch (error) {
              console.error('Failed to connect AI agent:', error);
            }
          }
        }}
      />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-[#2d2e31] border-[#3c4043] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-white">
              Leave this call?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#9aa0a6]">
              Are you sure you want to leave the call? You can rejoin at any
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="mt-0 bg-[#3c4043] border-[#5f6368] text-white hover:bg-[#4a4d51] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLeave}
              className="bg-[#ea4335] hover:bg-[#d33426] text-white"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
