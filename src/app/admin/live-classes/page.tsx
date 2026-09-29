'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Video, Radio, Users, Calendar, Clock,
  Plus, Trash2, CheckCircle2, Play, Square, ExternalLink, X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LiveClassroom } from '@/components/live/live-classroom';
import { formatDate } from '@/lib/utils';

interface LiveClass {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  scheduledAt: string;
  duration: number;
  meetingUrl?: string | null;
  meetingId?: string | null;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
  attendees: number;
}

interface CourseOption {
  id: string;
  title: string;
}

export default function AdminLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<LiveClass | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState('60');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchLiveClasses();
    fetchCourses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/live-classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load live classes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setCourses(data.data.map((c: any) => ({ id: c.id, title: c.title })));
        if (data.data.length > 0) {
          setCourseId(data.data[0].id);
        }
      }
    } catch {
      // Courses fetch fallback
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !scheduledAt) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          courseId,
          scheduledAt,
          duration: parseInt(duration) || 60,
          meetingUrl: meetingUrl.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to schedule class');
      }

      toast({ title: 'Class Scheduled! 📡', description: 'Live lecture broadcast has been queued.' });
      setModalOpen(false);
      setTitle('');
      setMeetingUrl('');
      setDescription('');
      fetchLiveClasses();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'LIVE' | 'ENDED' | 'SCHEDULED') => {
    try {
      const res = await fetch('/api/admin/live-classes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Class status updated to ${newStatus}` });
        fetchLiveClasses();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string, classTitle: string) => {
    if (!confirm(`Delete live class "${classTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/live-classes?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Class Deleted', description: `"${classTitle}" has been removed.` });
        fetchLiveClasses();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete class', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Live Classroom Broadcasts & Studios
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitor active video lectures, attendances, and streaming sessions
            </p>
          </div>
          <Button variant="gradient" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Schedule Live Class
          </Button>
        </div>

        {/* Live Admin Observation Screen */}
        {activeSession && (
          <div className="space-y-3">
            <LiveClassroom
              classId={activeSession.id}
              title={activeSession.title}
              courseTitle={activeSession.courseTitle}
              instructorName={activeSession.teacherName}
              userName="Admin Monitor"
              userRole="ADMIN"
              meetingType={activeSession.meetingUrl?.includes('zoom') ? 'ZOOM' : 'WEBRTC'}
              meetingUrl={activeSession.meetingUrl || undefined}
              meetingId={activeSession.meetingId || undefined}
              onClose={() => setActiveSession(null)}
            />
          </div>
        )}

        {/* Live Streams Monitor Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Live Lectures Active</span>
            <p className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              {classes.filter(c => c.status === 'LIVE').length} Streaming Now
            </p>
            <p className="text-[11px] text-slate-400">WebRTC HD Stream Health: 100%</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Scheduled Sessions</span>
            <p className="text-2xl font-bold text-slate-900">
              {classes.filter(c => c.status === 'SCHEDULED').length} Upcoming
            </p>
            <p className="text-[11px] text-slate-400">Automated student notifications & links</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Live Classes</span>
            <p className="text-2xl font-bold text-brand-600">
              {classes.length} Sessions
            </p>
            <p className="text-[11px] text-slate-400">Recorded and archived in database</p>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">All Lecture Broadcasts</h2>
            <span className="text-xs text-muted-foreground">{classes.length} total</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Video className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p>No live classes scheduled yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classes.map(c => {
                const dateObj = new Date(c.scheduledAt);
                const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={c.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          c.status === 'LIVE'
                            ? 'bg-red-100 text-red-800 animate-pulse'
                            : c.status === 'SCHEDULED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-xs text-brand-600 font-semibold">{c.courseTitle}</span>
                        {c.meetingUrl && (
                          <span className="text-[11px] text-slate-400">
                            • {c.meetingUrl.includes('zoom') ? 'Zoom' : 'WebRTC/External'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">
                        {c.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Teacher: <strong className="text-slate-700">{c.teacherName}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {dateStr}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {timeStr} ({c.duration} mins)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-brand-600" /> {c.attendees} Students
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {c.status === 'SCHEDULED' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(c.id, 'LIVE')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
                        >
                          <Play className="w-3 h-3 mr-1" /> Go Live
                        </Button>
                      )}

                      {c.status === 'LIVE' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(c.id, 'ENDED')}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3"
                        >
                          <Square className="w-3 h-3 mr-1" /> End Session
                        </Button>
                      )}

                      <Button
                        variant={c.status === 'LIVE' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveSession(c)}
                        className={`text-xs h-8 px-3 ${c.status === 'LIVE' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                      >
                        {c.status === 'LIVE' ? (
                          <>
                            <Radio className="w-3 h-3 mr-1 animate-pulse" /> Moderate Live
                          </>
                        ) : (
                          'Studio Studio'
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c.id, c.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Schedule Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-brand-600" /> Schedule Live Class
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Session Title *</label>
                  <Input
                    placeholder="e.g. Physics - Motion Numerical Problems"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Course *</label>
                  <select
                    className="form-input text-sm w-full"
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    required
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={e => setScheduledAt(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                    <Input
                      type="number"
                      min="15"
                      max="300"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Meeting / Stream URL (Optional)</label>
                  <Input
                    placeholder="e.g. https://meet.google.com/xyz or Zoom URL"
                    value={meetingUrl}
                    onChange={e => setMeetingUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Description / Notes</label>
                  <textarea
                    rows={3}
                    className="form-input text-sm w-full resize-none"
                    placeholder="Key concepts or agenda for the live session..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" loading={submitting}>
                    Schedule Session
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
