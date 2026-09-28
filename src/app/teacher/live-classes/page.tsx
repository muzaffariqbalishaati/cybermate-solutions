'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Plus, Calendar, Clock, Radio, Users, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LiveClassroom } from '@/components/live/live-classroom';

interface LiveClass {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  meetingType?: 'WEBRTC' | 'ZOOM' | 'YOUTUBE';
  meetingUrl?: string;
  meetingId?: string;
}

const initialClasses: LiveClass[] = [
  {
    id: 'lc-1',
    title: 'Optics & Ray Diagrams Masterclass',
    course: 'Class 10 Board Excellence',
    date: 'Today',
    time: '5:00 PM IST',
    duration: '90 mins',
    status: 'LIVE',
    meetingType: 'WEBRTC',
  },
  {
    id: 'lc-2',
    title: 'Quadratic Equations Speed Drill & Doubt Clearance',
    course: 'Class 10 Board Excellence',
    date: 'Tomorrow',
    time: '6:00 PM IST',
    duration: '75 mins',
    status: 'SCHEDULED',
    meetingType: 'ZOOM',
    meetingUrl: 'https://zoom.us/j/9876543210',
    meetingId: '987 654 3210',
  },
  {
    id: 'lc-3',
    title: 'Chemical Reactions & Balancing Equations Session',
    course: 'Complete Chemistry Foundations',
    date: 'Yesterday',
    time: '4:00 PM IST',
    duration: '85 mins',
    status: 'ENDED',
    meetingType: 'WEBRTC',
  },
];

export default function TeacherLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>(initialClasses);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStudioClass, setActiveStudioClass] = useState<LiveClass | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Class 10 Board Excellence');
  const [time, setTime] = useState('5:00 PM');
  const [date, setDate] = useState('Today');
  const [meetingType, setMeetingType] = useState<'WEBRTC' | 'ZOOM'>('WEBRTC');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingId, setMeetingId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newClass: LiveClass = {
      id: `lc-${Date.now()}`,
      title,
      course,
      date,
      time,
      duration: '60 mins',
      status: 'SCHEDULED',
      meetingType,
      meetingUrl: meetingType === 'ZOOM' ? meetingUrl : undefined,
      meetingId: meetingType === 'ZOOM' ? meetingId : undefined,
    };

    setClasses([newClass, ...classes]);
    setModalOpen(false);
    setTitle('');
    setMeetingUrl('');
    setMeetingId('');
    toast({
      title: 'Class Scheduled! 📡',
      description: `Class scheduled with ${meetingType === 'ZOOM' ? 'Zoom Integration' : 'EduPro WebRTC HD Studio'}.`,
    });
  };

  const handleStartClass = (c: LiveClass) => {
    setActiveStudioClass(c);
    // Mark class as LIVE if it was scheduled
    setClasses(prev => prev.map(item => item.id === c.id ? { ...item, status: 'LIVE' } : item));
    toast({
      title: 'Broadcast Studio Ready 🎙️',
      description: 'Connected to live room. Turn on camera and mic to begin.',
    });
  };

  return (
    <TeacherLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Live Class Broadcast Studio
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Host interactive video lectures with WebRTC HD audio/video or Zoom integration
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule Live Class
          </Button>
        </div>

        {/* Live Broadcast Studio Stage */}
        {activeStudioClass && (
          <div className="space-y-3">
            <LiveClassroom
              classId={activeStudioClass.id}
              title={activeStudioClass.title}
              courseTitle={activeStudioClass.course}
              instructorName="Dr. Rajesh Kumar"
              userName="Dr. Rajesh Kumar (Faculty)"
              userRole="TEACHER"
              meetingType={activeStudioClass.meetingType || 'WEBRTC'}
              meetingUrl={activeStudioClass.meetingUrl}
              meetingId={activeStudioClass.meetingId}
              onClose={() => setActiveStudioClass(null)}
            />
          </div>
        )}

        {/* Studio Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Live Status</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {classes.filter(c => c.status === 'LIVE').length} Active
            </p>
            <p className="text-[11px] text-slate-400">WebRTC HD Stream Ready</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Scheduled Sessions</span>
            <p className="text-2xl font-bold text-slate-900">
              {classes.filter(c => c.status === 'SCHEDULED').length} Upcoming
            </p>
            <p className="text-[11px] text-slate-400">Calendar synced</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Enrolled Attendees</span>
            <p className="text-2xl font-bold text-brand-600">84 Students</p>
            <p className="text-[11px] text-slate-400">Average 92% attendance</p>
          </div>
        </div>

        {/* Schedule Class Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-bold text-slate-900">Schedule New Live Lecture</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lecture Title</label>
                  <Input
                    required
                    placeholder="e.g. Masterclass: Thermodynamics Numerical Practice"
                    className="text-xs h-10"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Batch / Course</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-brand-500"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                  >
                    <option>Class 10 Board Excellence</option>
                    <option>Complete Chemistry Foundations</option>
                    <option>Class 12 Physics - JEE Foundation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Date</label>
                    <Input
                      placeholder="e.g. Tomorrow"
                      className="text-xs h-10"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Time (IST)</label>
                    <Input
                      placeholder="e.g. 6:30 PM"
                      className="text-xs h-10"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Platform Provider Selector */}
                <div className="space-y-2 pt-1 border-t">
                  <label className="text-xs font-semibold text-slate-700">Video Platform</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMeetingType('WEBRTC')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        meetingType === 'WEBRTC'
                          ? 'border-brand-600 bg-brand-50/50 text-brand-900 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-brand-600">
                        <Radio className="w-3.5 h-3.5" />
                        <span>EduPro WebRTC</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">Built-in browser video studio</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMeetingType('ZOOM')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        meetingType === 'ZOOM'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                        <Video className="w-3.5 h-3.5" />
                        <span>Zoom Meeting</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">Zoom app / meeting link</p>
                    </button>
                  </div>
                </div>

                {meetingType === 'ZOOM' && (
                  <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Zoom Join URL</label>
                      <Input
                        placeholder="https://zoom.us/j/1234567890"
                        className="text-xs h-9 bg-white"
                        value={meetingUrl}
                        onChange={e => setMeetingUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Meeting ID / Passcode</label>
                      <Input
                        placeholder="e.g. 123 456 7890 (Pass: 12345)"
                        className="text-xs h-9 bg-white"
                        value={meetingId}
                        onChange={e => setMeetingId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Schedule Class
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Classes List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Live Class Schedule</h2>

          {classes.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    c.status === 'LIVE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-brand-600 font-semibold">{c.course}</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    • {c.meetingType === 'ZOOM' ? 'Zoom Meeting' : 'WebRTC HD Studio'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  {c.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {c.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {c.time} ({c.duration})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {c.status === 'LIVE' ? (
                  <Button
                    onClick={() => handleStartClass(c)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-5 px-6 shadow-lg shadow-red-600/20"
                  >
                    <Radio className="w-4 h-4 mr-2 animate-pulse" />
                    Enter Studio & Broadcast
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleStartClass(c)}
                    className="text-xs font-semibold hover:border-brand-500 hover:text-brand-600"
                  >
                    Start Early
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </TeacherLayout>
  );
}
