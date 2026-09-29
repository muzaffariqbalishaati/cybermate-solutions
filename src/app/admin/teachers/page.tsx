'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhotoUpload } from '@/components/ui/photo-upload';
import {
  Users, Plus, Star, BookOpen, Mail, Phone,
  GraduationCap, RefreshCw, Trash2, X, Pencil,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  teacher?: {
    qualification?: string | null;
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Form State
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('5+ Years');
  const [qualification, setQualification] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [password, setPassword] = useState('Teacher@123');

  // Edit Form State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editExperience, setEditExperience] = useState<number | string>(5);
  const [editQualification, setEditQualification] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

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
          qualification: qualification.trim() || null,
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // If avatar provided, update it via patch
        if (avatar && data.data?.id) {
          await fetch('/api/admin/teachers', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.data.id, avatar }),
          });
        }

        toast({
          title: 'Faculty Added! 👨‍🏫',
          description: `Teacher profile created for ${name}.`,
        });
        setModalOpen(false);
        setName('');
        setSpecialization('');
        setEmail('');
        setPhone('');
        setAvatar(null);
        setQualification('');
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

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setEditName(t.name);
    setEditEmail(t.email);
    setEditPhone(t.phone || '');
    setEditAvatar(t.avatar || null);
    setEditSpecialization(t.teacher?.specialization || '');
    setEditExperience(t.teacher?.experience || 5);
    setEditQualification(t.teacher?.qualification || '');
    setEditBio(t.teacher?.bio || '');
    setEditIsActive(t.isActive);
    setEditModalOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTeacher.id,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim() || null,
          avatar: editAvatar || null,
          specialization: editSpecialization.trim() || null,
          experience: editExperience,
          qualification: editQualification.trim() || null,
          bio: editBio.trim() || null,
          isActive: editIsActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Faculty Updated! ✨',
          description: `${editName} profile details have been saved.`,
        });
        setEditModalOpen(false);
        fetchTeachers();
      } else {
        throw new Error(data.error || 'Failed to update teacher');
      }
    } catch (err: any) {
      toast({ title: 'Update Error', description: err.message, variant: 'destructive' });
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
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Faculty Directory & Mentors
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage verified educator profiles, specializations, photos, and course assignments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchTeachers} title="Refresh" className="rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 app-tap"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New Faculty
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Educators</span>
            <p className="text-2xl font-bold text-slate-900">{teachers.length} Faculty</p>
            <p className="text-[11px] text-slate-400">Verified teaching staff</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Live & Video Batches</span>
            <p className="text-2xl font-bold text-brand-600">
              {teachers.reduce((acc, t) => acc + (t._count?.assignedCourses || 0), 0)} Courses
            </p>
            <p className="text-[11px] text-slate-400">Assigned across subjects</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Platform Rating</span>
            <p className="text-2xl font-bold text-amber-500">4.9 / 5.0 ⭐</p>
            <p className="text-[11px] text-slate-400">From 12,000+ student ratings</p>
          </div>
        </div>

        {/* Modal: Add Faculty */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
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
                <PhotoUpload
                  value={avatar}
                  onChange={setAvatar}
                  name={name || 'Teacher'}
                  label="Educator Photo"
                  size="md"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Dr. Rajesh Verma"
                    className="text-xs h-10 rounded-xl"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    required
                    type="email"
                    placeholder="faculty@cybermatesolutions.com"
                    className="text-xs h-10 rounded-xl"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <Input
                    placeholder="+91 9934215013"
                    className="text-xs h-10 rounded-xl"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subject Specialization</label>
                  <Input
                    placeholder="e.g. Physics & Mechanics (Ex-IIT Roorkee)"
                    className="text-xs h-10 rounded-xl"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Experience</label>
                    <Input
                      placeholder="e.g. 10+ Years"
                      className="text-xs h-10 rounded-xl"
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <Input
                      type="password"
                      placeholder="Teacher@123"
                      className="text-xs h-10 rounded-xl"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20">
                    Create Faculty Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Faculty */}
        {editModalOpen && editingTeacher && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Edit Educator Profile</h3>
                  <p className="text-xs text-slate-400">Modify credentials, subjects, photo, or status</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSave} className="space-y-4">
                <PhotoUpload
                  value={editAvatar}
                  onChange={setEditAvatar}
                  name={editName || 'Teacher'}
                  label="Educator Photo"
                  size="md"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <Input
                      required
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <Input
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="+91 9934215013"
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subject Specialization</label>
                  <Input
                    value={editSpecialization}
                    onChange={e => setEditSpecialization(e.target.value)}
                    placeholder="e.g. Mathematics, JEE Advanced"
                    className="text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Qualification</label>
                    <Input
                      value={editQualification}
                      onChange={e => setEditQualification(e.target.value)}
                      placeholder="e.g. M.Sc, Ph.D"
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Experience (Years)</label>
                    <Input
                      type="number"
                      value={editExperience}
                      onChange={e => setEditExperience(parseInt(e.target.value) || 0)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Bio / About</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Teacher bio and teaching background..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Faculty Status</p>
                    <p className="text-[11px] text-slate-400">Allow teacher to login and conduct sessions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditIsActive(!editIsActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      editIsActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {editIsActive ? 'Active' : 'Suspended'}
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} className="text-xs rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-52 animate-pulse" />
            ))
          ) : teachers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border">
              No faculty profiles found.
            </div>
          ) : (
            teachers.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md overflow-hidden flex-shrink-0">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          t.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{t.name}</h3>
                          {!t.isActive && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold">Inactive</span>
                          )}
                        </div>
                        <p className="text-xs text-brand-600 font-medium truncate">
                          {t.teacher?.specialization || 'Educator'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-slate-400 hover:text-brand-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100 app-tap"
                        title="Edit Faculty"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-xl hover:bg-red-50 app-tap"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t.teacher?.experience ? `${t.teacher.experience}+ Years Experience` : 'Experienced Faculty'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    {t.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
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
