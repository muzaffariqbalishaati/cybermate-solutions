'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Megaphone, Plus, Bell, Trash2, Calendar, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetRole: string | null;
  priority: string;
  createdAt: string;
  isActive: boolean;
  createdBy?: { name: string } | null;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT'>('ALL');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load announcements', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, noticeTitle: string) => {
    if (!confirm(`Delete announcement "${noticeTitle}"?`)) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        toast({ title: 'Announcement Deleted' });
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast({ title: 'Required Fields', description: 'Title and notice message are required', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          targetRole,
          priority,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Announcement Published! 📢',
          description: 'Notice pushed to all selected user dashboards.',
        });
        setModalOpen(false);
        setTitle('');
        setMessage('');
        fetchAnnouncements();
      } else {
        throw new Error(data.error || 'Failed to publish announcement');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchAnnouncements} title="Refresh Notices">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Announcement
            </Button>
          </div>
        </div>

        {/* Modal: Create Announcement */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Publish Broadcast Notice</h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Notice Title *</label>
                  <Input
                    required
                    placeholder="e.g. Pre-Board Mock Examination Timetable"
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
                      <option value="NORMAL">Standard Notice</option>
                      <option value="HIGH">High Priority (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write detailed broadcast notice message..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-500"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs">
                    Broadcast Notice
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm h-32 animate-pulse" />
            ))
          ) : announcements.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border">
              No announcements published yet. Click "Create Announcement" to post your first notice.
            </div>
          ) : (
            announcements.map(a => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        a.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {a.priority === 'HIGH' ? 'High Priority' : 'Notice'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Audience: <strong className="text-slate-800">{a.targetRole || 'Everyone'}</strong>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {a.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    className="text-slate-300 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {a.message}
                </p>

                <div className="pt-2 border-t flex items-center justify-between text-[11px] text-slate-400">
                  <span>Published {formatDate(a.createdAt)}</span>
                  {a.createdBy?.name && <span>By {a.createdBy.name}</span>}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
