'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Users,
  MessageSquare,
  Shield,
  Radio,
  Settings,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LiveClassroomProps {
  classId: string;
  title: string;
  courseTitle: string;
  instructorName: string;
  userName: string;
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN';
  meetingType?: 'WEBRTC' | 'ZOOM' | 'YOUTUBE';
  meetingUrl?: string | null;
  meetingId?: string | null;
  onClose: () => void;
}

export function LiveClassroom({
  classId,
  title,
  courseTitle,
  instructorName,
  userName,
  userRole,
  meetingType = 'WEBRTC',
  meetingUrl,
  meetingId,
  onClose,
}: LiveClassroomProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'zoom' | 'chat'>('video');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate safe deterministic room name for Jitsi WebRTC
  const sanitizedRoom = `EduPro_${classId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  // Jitsi Meet Embed URL with configurations
  const jitsiUrl = `https://meet.jit.si/${sanitizedRoom}#userInfo.displayName=${encodeURIComponent(
    `${userName} (${userRole === 'TEACHER' ? 'Instructor' : 'Student'})`
  )}&config.prejoinPageEnabled=false&config.startWithAudioMuted=${
    userRole === 'STUDENT' ? 'true' : 'false'
  }&config.startWithVideoMuted=false&config.toolbarButtons=${encodeURIComponent(
    JSON.stringify([
      'microphone',
      'camera',
      'closedcaptions',
      'desktop',
      'fullscreen',
      'fodeviceselection',
      'hangup',
      'chat',
      'raisehand',
      'videoquality',
      'filmstrip',
      'tileview',
      'select-background',
    ])
  )}`;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        toast({ title: 'Fullscreen Error', description: err.message, variant: 'destructive' });
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col text-white transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-[680px]'
      }`}
    >
      {/* Top Classroom Control Bar */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE
          </div>

          <div className="truncate">
            <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">{title}</h2>
            <p className="text-[11px] text-slate-400 truncate">
              {courseTitle} • Instructor: <span className="text-brand-400 font-medium">{instructorName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Stream Type Pill */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <Radio className="w-3 h-3 text-brand-400 animate-pulse" />
            {meetingType === 'ZOOM' ? 'Zoom Live' : 'WebRTC HD Stream'}
          </span>

          {/* Fullscreen Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-slate-300 hover:text-white hover:bg-slate-800 p-2 h-8 w-8"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* Leave/End Class Button */}
          <Button
            size="sm"
            variant="destructive"
            onClick={onClose}
            className="text-xs font-bold px-3 py-1 h-8 bg-red-600 hover:bg-red-700"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            {userRole === 'TEACHER' ? 'End Broadcast' : 'Leave'}
          </Button>
        </div>
      </div>

      {/* Main Video Stream Container */}
      <div className="flex-1 relative bg-black flex flex-col min-h-0">
        {meetingType === 'ZOOM' && meetingUrl ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-2xl">
              <Video className="w-10 h-10" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white">Zoom Meeting Session</h3>
              <p className="text-sm text-slate-400">
                This class is hosted via Zoom for enterprise-grade video conferencing and breakout rooms.
              </p>
              {meetingId && (
                <div className="inline-block bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 mt-2">
                  Meeting ID: <span className="text-white font-bold">{meetingId}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Launch Zoom Meeting App
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(meetingUrl);
                  toast({ title: 'Link Copied', description: 'Zoom link copied to clipboard.' });
                }}
                className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Copy Link
              </Button>
            </div>
          </div>
        ) : (
          /* WebRTC Jitsi Interactive Room */
          <iframe
            src={jitsiUrl}
            title={`Live Classroom: ${title}`}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0 bg-slate-950"
          />
        )}
      </div>

      {/* Classroom Status Footer */}
      <div className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Connected & Encrypted (WebRTC)
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline">Logged in as: <strong className="text-slate-200">{userName}</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-400">
            Need help? Click Raise Hand in controls
          </span>
        </div>
      </div>
    </div>
  );
}
