'use client';

import { useState } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import {
  Video, PlayCircle, Calendar, Clock, User,
  CheckCircle2, AlertCircle, MessageSquare, Hand,
  Volume2, Maximize2, Radio, Download, Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LiveClassroom } from '@/components/live/live-classroom';

interface LiveClass {
  id: string;
  title: string;
  subject: string;
  courseTitle: string;
  teacher: string;
  teacherAvatar: string;
  scheduledAt: string;
  duration: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  recordingUrl?: string;
  meetingType?: 'WEBRTC' | 'ZOOM' | 'YOUTUBE';
  meetingUrl?: string;
  meetingId?: string;
}

const mockClasses: LiveClass[] = [
  {
    id: 'lc-1',
    title: 'Live Rapid Revision: Optics & Ray Diagrams Masterclass',
    subject: 'Physics',
    courseTitle: 'Class 10 Board Excellence',
    teacher: 'Dr. Rajesh Verma',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    scheduledAt: 'Today, 5:00 PM IST',
    duration: '90 mins',
    status: 'LIVE',
    meetingType: 'WEBRTC',
  },
  {
    id: 'lc-2',
    title: 'Doubt Clearing & Numerical Practice: Quadratic Equations',
    subject: 'Mathematics',
    courseTitle: 'Class 10 Board Excellence',
    teacher: 'Prof. Vikram Malhotra',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    scheduledAt: 'Tomorrow, 6:00 PM IST',
    duration: '75 mins',
    status: 'SCHEDULED',
    meetingType: 'ZOOM',
    meetingUrl: 'https://zoom.us/j/9876543210',
    meetingId: '987 654 3210',
  },
  {
    id: 'lc-3',
    title: 'Chemical Reactions & Balancing Equations - Problem Solving',
    subject: 'Chemistry',
    courseTitle: 'Complete Chemistry Foundations',
    teacher: 'Meenakshi Iyer',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    scheduledAt: 'Yesterday',
    duration: '85 mins',
    status: 'ENDED',
    recordingUrl: '#',
  },
  {
    id: 'lc-4',
    title: 'Board Exam Strategy & High-Yield Questions Discussion',
    subject: 'General Science',
    courseTitle: 'Class 10 Board Excellence',
    teacher: 'Dr. Rajesh Verma',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    scheduledAt: '3 days ago',
    duration: '60 mins',
    status: 'ENDED',
    recordingUrl: '#',
  },
];

export default function StudentLiveClassesPage() {
  const [activeRoom, setActiveRoom] = useState<LiveClass | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { user: 'Aarav', msg: 'Good evening Sir! Ready for Optics!' },
    { user: 'Sneha', msg: 'Sir will we solve the lens formula questions from 2024 board?' },
    { user: 'Dr. Rajesh Verma', msg: 'Welcome everyone! Yes Sneha, we have 8 past board numericals lined up.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [handRaised, setHandRaised] = useState(false);

  const liveClass = mockClasses.find(c => c.status === 'LIVE');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([...chatMessages, { user: 'You', msg: inputMsg }]);
    setInputMsg('');
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    toast({
      title: !handRaised ? 'Hand Raised ✋' : 'Hand Lowered',
      description: !handRaised ? 'The teacher has been notified that you have a question.' : '',
    });
  };

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Live Interactive Classes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Join real-time lectures, ask questions, and interact with your mentors
            </p>
          </div>
        </div>

        {/* Interactive Classroom View Modal / In-Page Stage */}
        {activeRoom ? (
          <div className="space-y-4">
            <LiveClassroom
              classId={activeRoom.id}
              title={activeRoom.title}
              courseTitle={activeRoom.courseTitle}
              instructorName={activeRoom.teacher}
              userName="Arjun Gupta"
              userRole="STUDENT"
              meetingType={(activeRoom as any).meetingType || 'WEBRTC'}
              meetingUrl={(activeRoom as any).meetingUrl}
              meetingId={(activeRoom as any).meetingId}
              onClose={() => setActiveRoom(null)}
            />
          </div>


        ) : null}

        {/* Live Now Featured Card */}
        {liveClass && !activeRoom && (
          <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Live Right Now
                </span>
                <span className="text-xs text-slate-300">• {liveClass.subject}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                {liveClass.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <span>With {liveClass.teacher}</span>
                <span>•</span>
                <span>{liveClass.courseTitle}</span>
              </p>
            </div>

            <Button
              onClick={() => setActiveRoom(liveClass)}
              className="py-6 px-8 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/25 text-base flex-shrink-0"
            >
              <Radio className="w-5 h-5 mr-2 animate-pulse" />
              Join Live Class Now
            </Button>
          </div>
        )}

        {/* Scheduled & Past Sessions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Upcoming & Past Live Classes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClasses.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full">
                      {c.subject}
                    </span>
                    <span className={`font-semibold ${
                      c.status === 'LIVE' ? 'text-red-600' : c.status === 'SCHEDULED' ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      {c.status === 'LIVE' ? '● In Session' : c.scheduledAt}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {c.title}
                  </h3>

                  <div className="flex items-center gap-2.5 text-xs text-slate-600 pt-1">
                    <img
                      src={c.teacherAvatar}
                      alt={c.teacher}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <span>{c.teacher}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {c.status === 'LIVE' ? (
                    <Button
                      onClick={() => setActiveRoom(c)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                    >
                      Join Class
                    </Button>
                  ) : c.status === 'SCHEDULED' ? (
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: 'Reminder Set', description: `We will notify you 15 minutes before ${c.title}` })}
                      className="w-full text-xs font-semibold"
                    >
                      Set Class Reminder
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => toast({ title: 'Playing Recording', description: `Loading archive for ${c.title}` })}
                      className="w-full text-xs font-semibold"
                    >
                      <PlayCircle className="w-4 h-4 mr-1.5" />
                      Watch Recording ({c.duration})
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
