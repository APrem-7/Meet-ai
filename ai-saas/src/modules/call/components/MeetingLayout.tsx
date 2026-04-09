'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from './TopBar';
import { VideoGrid } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { ParticipantSidebar } from './ParticipantSidebar';
import { ChatPanel } from './ChatPanel';

interface MeetingLayoutProps {
  meetingId: string;
  onLeave: () => void;
  agentConnected?: boolean;
  onAgentToggle?: () => void;
  className?: string;
}

export const MeetingLayout = ({
  meetingId,
  onLeave,
  agentConnected = false,
  onAgentToggle,
  className,
}: MeetingLayoutProps) => {
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleParticipants = useCallback(() => {
    setIsParticipantsOpen((prev) => {
      if (!prev) setIsChatOpen(false); // Close chat when opening participants
      return !prev;
    });
  }, []);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) setIsParticipantsOpen(false); // Close participants when opening chat
      return !prev;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // TODO: Implement Ctrl+D keyboard shortcut to toggle microphone.
      // Use useCallStateHooks().useMicrophoneState() and call microphone.toggle().
      // TODO: Implement Ctrl+E keyboard shortcut to toggle camera.
      // Use useCallStateHooks().useCameraState() and call camera.toggle().
      // Escape to close sidebars
      if (e.key === 'Escape') {
        setIsParticipantsOpen(false);
        setIsChatOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isSidebarOpen = isParticipantsOpen || isChatOpen;

  return (
    <div
      className={cn(
        'flex h-screen w-screen flex-col bg-[#202124] overflow-hidden',
        className
      )}
    >
      {/* Top Bar */}
      <TopBar meetingId={meetingId} />

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Video Grid Area */}
        <div
          className={cn(
            'flex-1 min-w-0 transition-all duration-300 ease-in-out',
            isSidebarOpen && 'mr-0'
          )}
        >
          <VideoGrid className="h-full" />
        </div>

        {/* Sidebar Panels */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden h-full',
            isSidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          <ParticipantSidebar
            isOpen={isParticipantsOpen}
            onClose={() => setIsParticipantsOpen(false)}
          />
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </div>

      {/* Bottom Control Bar */}
      <ControlBar
        onLeave={onLeave}
        onToggleParticipants={handleToggleParticipants}
        onToggleChat={handleToggleChat}
        isParticipantsOpen={isParticipantsOpen}
        isChatOpen={isChatOpen}
        meetingId={meetingId}
        agentConnected={agentConnected}
        onAgentToggle={onAgentToggle}
      />
    </div>
  );
};
