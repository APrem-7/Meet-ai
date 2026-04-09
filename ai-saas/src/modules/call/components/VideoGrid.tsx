'use client';

import { useMemo, useState } from 'react';
import {
  useCallStateHooks,
  ParticipantsAudio,
} from '@stream-io/video-react-sdk';
import { VideoTile } from './VideoTile';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
}

export const VideoGrid = ({ className }: VideoGridProps) => {
  const { useParticipants, useDominantSpeaker, useRemoteParticipants } =useCallStateHooks();
    const remoteParticipants = useRemoteParticipants();
  const participants = useParticipants();
  const dominantSpeaker = useDominantSpeaker();
  // TODO: Expose a UI control (e.g. context menu or pin icon on VideoTile) to allow users
  // to pin/unpin a participant. Wire the onClick to call setPinnedParticipantId(sessionId).
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(
    null
  );

  // Find screen sharing participant
  const screenShareParticipant = useMemo(
    () =>
      participants.find(
        (p) => p.publishedTracks.includes(3) // SCREEN_SHARE track type
      ),
    [participants]
  );

  const pinnedParticipant = useMemo(
    () => participants.find((p) => p.sessionId === pinnedParticipantId),
    [participants, pinnedParticipantId]
  );

  const participantCount = participants.length;

  // Determine grid layout based on participant count
  const gridConfig = useMemo(() => {
    if (pinnedParticipant || screenShareParticipant) {
      return { cols: 1, rows: 1, mode: 'spotlight' as const };
    }

    if (participantCount <= 1)
      return { cols: 1, rows: 1, mode: 'grid' as const };
    if (participantCount === 2)
      return { cols: 2, rows: 1, mode: 'grid' as const };
    if (participantCount <= 4)
      return { cols: 2, rows: 2, mode: 'grid' as const };
    if (participantCount <= 6)
      return { cols: 3, rows: 2, mode: 'grid' as const };
    if (participantCount <= 9)
      return { cols: 3, rows: 3, mode: 'grid' as const };
    return { cols: 4, rows: 3, mode: 'grid' as const };
  }, [participantCount, pinnedParticipant, screenShareParticipant]);

  // Spotlight mode: one main + side strip
  if (gridConfig.mode === 'spotlight') {
    const spotlightParticipant =
      pinnedParticipant || screenShareParticipant || participants[0];
    const otherParticipants = participants.filter(
      (p) => p.sessionId !== spotlightParticipant?.sessionId
    );

    return (
      <>
        <ParticipantsAudio participants={remoteParticipants} />
        <div className={cn('flex h-full w-full gap-2 p-2', className)}>
          {/* Main spotlight video */}
          <div className="flex-1 min-w-0">
            {spotlightParticipant && (
              <VideoTile
                participant={spotlightParticipant}
                isSpeaking={
                  dominantSpeaker?.sessionId === spotlightParticipant.sessionId
                }
                isPinned={
                  pinnedParticipantId === spotlightParticipant.sessionId
                }
                className="h-full w-full"
              />
            )}
          </div>

          {/* Side strip for other participants */}
          {otherParticipants.length > 0 && (
            <div className="flex w-48 flex-col gap-2 overflow-y-auto lg:w-56 xl:w-64">
              {otherParticipants.map((participant) => (
                <VideoTile
                  key={participant.sessionId}
                  participant={participant}
                  isSpeaking={
                    dominantSpeaker?.sessionId === participant.sessionId
                  }
                  className="aspect-video w-full shrink-0"
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Grid mode
  return (<>
  <ParticipantsAudio participants={remoteParticipants} />
    <div
      className={cn('grid h-full w-full gap-2 p-2', className)}
      style={{
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
      }}
    >
      {participants.map((participant) => (
        
        <VideoTile
          key={participant.sessionId}
          participant={participant}
          isSpeaking={dominantSpeaker?.sessionId === participant.sessionId}
          isPinned={pinnedParticipantId === participant.sessionId}
          className="h-full w-full min-h-0"
        />
      ))}
    </div>
  </>);
};
