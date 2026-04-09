'use client';

import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Users,
  MessageSquare,
  MoreVertical,
  PhoneOff,
  Hand,
  Settings,
  CircleDot,
  Captions,
  Bot,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ControlBarProps {
  onLeave: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  isParticipantsOpen: boolean;
  isChatOpen: boolean;
  className?: string;
  meetingId: string;
  agentConnected?: boolean;
  onAgentToggle?: () => void;
}

export const ControlBar = ({
  onLeave,
  onToggleParticipants,
  onToggleChat,
  isParticipantsOpen,
  isChatOpen,
  className,
  meetingId,
  agentConnected = false,
  onAgentToggle,
}: ControlBarProps) => {
  const {
    useCameraState,
    useMicrophoneState,
    useScreenShareState,
  } = useCallStateHooks();

  const {
    camera,
    isMute: isCameraMuted,
    optimisticIsMute: optimisticCameraMuted,
  } = useCameraState();
  const {
    microphone,
    isMute: isMicMuted,
    optimisticIsMute: optimisticMicMuted,
  } = useMicrophoneState();
  const { screenShare, isMute: isScreenShareMuted } = useScreenShareState();

  // Check if screen sharing is currently active
  // (i.e. if the screen share track is published)
  const isScreenSharing = !isScreenShareMuted;

  return (
    <div
      className={cn(
        'flex h-20 items-center justify-center gap-2 bg-[#202124] border-t border-[#3c4043] px-4',
        className
      )}
    >
      {/* Left spacer for centering */}
      <div className="flex-1" />

      {/* Center controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Microphone Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={async () => await microphone.toggle()}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                optimisticMicMuted
                  ? 'bg-[#ea4335] text-white hover:bg-[#d33426]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label={
                optimisticMicMuted ? 'Unmute microphone' : 'Mute microphone'
              }
            >
              {optimisticMicMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {optimisticMicMuted
              ? 'Unmute microphone (Ctrl+D)'
              : 'Mute microphone (Ctrl+D)'}
          </TooltipContent>
        </Tooltip>

        {/* Camera Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={async () => await camera.toggle()}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                optimisticCameraMuted
                  ? 'bg-[#ea4335] text-white hover:bg-[#d33426]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label={
                optimisticCameraMuted ? 'Turn on camera' : 'Turn off camera'
              }
            >
              {optimisticCameraMuted ? (
                <VideoOff className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {optimisticCameraMuted
              ? 'Turn on camera (Ctrl+E)'
              : 'Turn off camera (Ctrl+E)'}
          </TooltipContent>
        </Tooltip>

        {/* Screen Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={async () => await screenShare.toggle()}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                isScreenSharing
                  ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <MonitorUp className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isScreenSharing ? 'Stop sharing' : 'Share your screen'}
          </TooltipContent>
        </Tooltip>

        {/* AI Agent Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onAgentToggle}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                agentConnected
                  ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label={
                agentConnected ? 'Disconnect AI agent' : 'Connect AI agent'
              }
            >
              <Bot className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {agentConnected ? 'Disconnect AI agent' : 'Connect AI agent'}
          </TooltipContent>
        </Tooltip>

        {/* Raise Hand */}
        {/* TODO: Implement raise hand functionality using Stream SDK's custom events or reactions API.
            Should toggle hand raised state and broadcast to other participants. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="hidden md:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#3c4043] text-white hover:bg-[#4a4d51] transition-all duration-200"
              aria-label="Raise hand"
            >
              <Hand className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Raise hand</TooltipContent>
        </Tooltip>

        {/* Participants Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleParticipants}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                isParticipantsOpen
                  ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label="Show participants"
            >
              <Users className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Participants</TooltipContent>
        </Tooltip>

        {/* Chat Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleChat}
              className={cn(
                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-200',
                isChatOpen
                  ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                  : 'bg-[#3c4043] text-white hover:bg-[#4a4d51]'
              )}
              aria-label="Show chat"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Chat</TooltipContent>
        </Tooltip>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="hidden md:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#3c4043] text-white hover:bg-[#4a4d51] transition-all duration-200"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            className="w-56 bg-[#2d2e31] border-[#3c4043] text-white"
          >
            {/* TODO: Implement meeting recording using Stream SDK's call.startRecording() / call.stopRecording().
                Should toggle recording state and show a recording indicator in the TopBar. */}
            <DropdownMenuItem className="gap-3 text-[#e8eaed] focus:bg-[#3c4043] focus:text-white cursor-pointer">
              <CircleDot className="h-4 w-4" />
              <span>Record meeting</span>
            </DropdownMenuItem>
            {/* TODO: Implement closed captions using Stream SDK's transcription API
                (call.startTranscription() / call.stopTranscription()).
                Should toggle captions on/off and render caption overlay on the video grid. */}
            <DropdownMenuItem className="gap-3 text-[#e8eaed] focus:bg-[#3c4043] focus:text-white cursor-pointer">
              <Captions className="h-4 w-4" />
              <span>Turn on captions</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3c4043]" />
            {/* TODO: Implement in-call settings panel (audio/video device selection, background effects, etc.).
                Should open a modal or sidebar with device settings similar to the pre-join DeviceSettings. */}
            <DropdownMenuItem className="gap-3 text-[#e8eaed] focus:bg-[#3c4043] focus:text-white cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Leave Call */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={async () => await onLeave()}
              className="flex h-10 w-16 md:h-12 md:w-20 items-center justify-center rounded-full bg-[#ea4335] text-white hover:bg-[#d33426] transition-all duration-200"
              aria-label="Leave call"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Leave call</TooltipContent>
        </Tooltip>
      </div>

      {/* Right spacer for centering */}
      <div className="flex-1" />
    </div>
  );
};
