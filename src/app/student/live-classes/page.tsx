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
          <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl text-white">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Now
                </span>
                <h2 className="font-bold text-sm sm:text-base text-slate-100">{activeRoom.title}</h2>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setActiveRoom(null)}
                className="text-xs"
              >
                Leave Classroom
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Teacher Video Stream */}
              <div className="lg:col-span-2 bg-black relative flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    Teacher: {activeRoom.teacher}
                  </span>
                  <span className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg">
                    👥 42 Students Attending
                  </span>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-brand-500 overflow-hidden mx-auto shadow-2xl">
                    <img
                      src={activeRoom.teacherAvatar}
                      alt={activeRoom.teacher}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white">Optics & Ray Diagrams Live Stage</h3>
                  <p className="text-xs text-emerald-400 font-medium">● HD Audio & Video Broadcast Active</p>
                </div>

                {/* Bottom Classroom Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={toggleHandRaise}
                    className={`text-xs font-semibold ${
                      handRaised ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Hand className="w-4 h-4 mr-1.5" />
                    {handRaised ? 'Lower Hand' : 'Raise Hand'}
                  </Button>
                </div>
              </div>

              {/* Live Classroom Chat */}
              <div className="lg:col-span-1 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-400" />
                    Live Class Discussion
                  </div>
                  <span className="text-[10px] text-slate-500">Moderated</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-0.5">
                      <span className={`font-bold ${m.user === 'You' ? 'text-brand-400' : m.user.includes('Dr.') ? 'text-amber-400' : 'text-slate-300'}`}>
                        {m.user}:
                      </span>
                      <p className="text-slate-200 mt-0.5">{m.msg}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    placeholder="Ask a question in class..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-700 text-xs">
                    Send
                  </Button>
                </form>
              </div>
            </div>
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
