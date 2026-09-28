'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Megaphone, Plus, Bell, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetRole: 'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT';
  priority: 'HIGH' | 'NORMAL';
  createdAt: string;
  isActive: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Pre-Board Mock Examination Series Schedule Released',
    message: 'The dates for the upcoming full-length board mock examinations for Class 10 & 12 have been published in student portals. Please review the timetable and syllabus.',
    targetRole: 'STUDENT',
    priority: 'HIGH',
    createdAt: '25 Sept 2026',
    isActive: true,
  },
  {
    id: 'ann-2',
    title: 'Parent-Teacher Virtual Conference - 5th October',
    message: 'Individual 1-on-1 virtual interaction slots between parents and subject mentors are now open for booking in the parent dashboard.',
    targetRole: 'PARENT',
    priority: 'HIGH',
    createdAt: '22 Sept 2026',
    isActive: true,
  },
  {
    id: 'ann-3',
    title: 'Platform Maintenance Notice: Sunday 2 AM - 4 AM IST',
    message: 'We will be upgrading our video streaming servers. Brief interruption in lecture downloads may occur.',
    targetRole: 'ALL',
    priority: 'NORMAL',
    createdAt: '18 Sept 2026',
    isActive: true,
  },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT'>('ALL');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Announcement Removed' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      targetRole,
      priority,
      createdAt: 'Just now',
      isActive: true,
    };

    setAnnouncements([newAnn, ...announcements]);
    setModalOpen(false);
    setTitle('');
    setMessage('');
    toast({
      title: 'Announcement Published! 📢',
      description: 'Notice pushed to all selected user portals.',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Broadcast Notices & Announcements
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Publish site-wide banners and role-targeted notifications
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Announcement
          </Button>
        </div>

        {/* Modal: Create Announcement */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Create Announcement</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Notice Title *</label>
                  <Input
                    required
                    placeholder="e.g. Schedule Update for Sunday Mock Tests"
                    className="text-xs h-10"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Target Audience</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                      value={targetRole}
                      onChange={e => setTargetRole(e.target.value as any)}
                    >
                      <option value="ALL">Everyone (Site-wide)</option>
                      <option value="STUDENT">Students Only</option>
                      <option value="TEACHER">Teachers Only</option>
                      <option value="PARENT">Parents Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Priority Level</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                    >
                      <option value="NORMAL">Normal Notice</option>
                      <option value="HIGH">High Priority (Red Alert)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Announcement Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed instructions or information..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Broadcast Now
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map(a => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    a.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {a.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-brand-600">
                    Audience: {a.targetRole}
                  </span>
                  <span className="text-xs text-slate-400">• {a.createdAt}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{a.message}</p>
              </div>

              <div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(a.id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
