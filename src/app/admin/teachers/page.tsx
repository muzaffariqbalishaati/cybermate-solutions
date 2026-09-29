'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Star, BookOpen, Mail, Phone, GraduationCap, RefreshCw, Trash2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  teacher?: {
    specialization: string | null;
    experience: number | string | null;
    bio: string | null;
  } | null;
  _count: {
    assignedCourses: number;
  };
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('5+ Years');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Teacher@123');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/teachers');
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load teachers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Missing details', description: 'Name and email are required', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          specialization: specialization.trim() || 'General Faculty',
          experience: experience.trim() || '5+ Years',
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Faculty Added! 👨‍🏫',
          description: `Teacher profile created for ${name}.`,
        });
        setModalOpen(false);
        setName('');
        setSpecialization('');
        setEmail('');
        setPhone('');
        fetchTeachers();
      } else {
        throw new Error(data.error || 'Failed to add teacher');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, teacherName: string) => {
    if (!confirm(`Are you sure you want to remove faculty "${teacherName}"?`)) return;

    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTeachers(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Teacher Removed', description: `${teacherName} profile deleted.` });
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Faculty Directory & Mentors
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage verified educator profiles, specializations, and course assignments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchTeachers} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New Faculty
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Educators</span>
            <p className="text-2xl font-bold text-slate-900">{teachers.length} Faculty</p>
            <p className="text-[11px] text-slate-400">Verified teaching staff</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Live & Video Batches</span>
            <p className="text-2xl font-bold text-brand-600">
              {teachers.reduce((acc, t) => acc + (t._count?.assignedCourses || 0), 0)} Courses
            </p>
            <p className="text-[11px] text-slate-400">Assigned across subjects</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Platform Rating</span>
            <p className="text-2xl font-bold text-amber-500">4.9 / 5.0 ⭐</p>
            <p className="text-[11px] text-slate-400">From 12,000+ student ratings</p>
          </div>
        </div>

        {/* Modal: Add Faculty */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Add New Educator</h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Dr. Rajesh Verma"
                    className="text-xs h-10"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    required
                    type="email"
                    placeholder="faculty@edupro.com"
                    className="text-xs h-10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <Input
                    placeholder="+91 98765 00000"
                    className="text-xs h-10"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subject Specialization</label>
                  <Input
                    placeholder="e.g. Physics & Mechanics (Ex-IIT Roorkee)"
                    className="text-xs h-10"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Teaching Experience</label>
                    <Input
                      placeholder="e.g. 15+ Years"
                      className="text-xs h-10"
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <Input
                      type="password"
                      placeholder="Teacher@123"
                      className="text-xs h-10"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs">
                    Create Faculty Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-48 animate-pulse" />
            ))
          ) : teachers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border">
              No faculty profiles found.
            </div>
          ) : (
            teachers.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          t.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                        <p className="text-xs text-brand-600 font-medium">
                          {t.teacher?.specialization || 'Educator'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="Delete Faculty"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.teacher?.experience ? `${t.teacher.experience}+ Years Experience` : 'Experienced Faculty'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    {t.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    {t._count?.assignedCourses || 0} Courses Assigned
                  </span>
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    4.9
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
