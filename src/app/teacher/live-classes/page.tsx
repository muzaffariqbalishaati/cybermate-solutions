'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Plus, Calendar, Clock, Radio, Users, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LiveClass {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
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
  },
  {
    id: 'lc-2',
    title: 'Quadratic Equations Speed Drill & Doubt Clearance',
    course: 'Class 10 Board Excellence',
    date: 'Tomorrow',
    time: '6:00 PM IST',
    duration: '75 mins',
    status: 'SCHEDULED',
  },
  {
    id: 'lc-3',
    title: 'Chemical Reactions & Balancing Equations Session',
    course: 'Complete Chemistry Foundations',
    date: 'Yesterday',
    time: '4:00 PM IST',
    duration: '85 mins',
    status: 'ENDED',
  },
];

export default function TeacherLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>(initialClasses);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Class 10 Board Excellence');
  const [time, setTime] = useState('5:00 PM');
  const [date, setDate] = useState('Today');

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
    };

    setClasses([newClass, ...classes]);
    setModalOpen(false);
    setTitle('');
    toast({
      title: 'Class Scheduled! 📡',
      description: 'Notification sent to all enrolled students.',
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
              Host interactive video lectures, screen share, and engage with live student chats
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule New Live Class
          </Button>
        </div>

        {/* Modal: Schedule Class */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Schedule Live Lecture</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lecture Topic *</label>
                  <Input
                    required
                    placeholder="e.g. Lens Formula & Numericals Speedrun"
                    className="text-xs h-10"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Batch / Course</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                  >
                    <option>Class 10 Board Excellence</option>
                    <option>Complete Chemistry Foundations</option>
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

                <div className="flex justify-end gap-3 pt-2">
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
          {classes.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    c.status === 'LIVE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-brand-600 font-semibold">{c.course}</span>
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

              <div>
                {c.status === 'LIVE' ? (
                  <Button
                    onClick={() => toast({ title: 'Studio Broadcast Started', description: 'Webcam & Microphone connected.' })}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-5 px-6"
                  >
                    <Radio className="w-4 h-4 mr-2 animate-pulse" />
                    Enter Studio & Broadcast
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => toast({ title: 'Class Started Early', description: 'Students can now join the waiting room.' })}
                    className="text-xs font-semibold"
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
