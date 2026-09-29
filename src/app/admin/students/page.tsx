'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhotoUpload } from '@/components/ui/photo-upload';
import {
  GraduationCap, Search, Plus, CheckCircle2,
  XCircle, Mail, Phone, BookOpen, ShieldCheck,
  RefreshCw, Trash2, UserCheck, UserX, X, Pencil
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  student?: {
    grade: string | null;
    school: string | null;
    city: string | null;
  } | null;
  _count: {
    enrollments: number;
    orders: number;
  };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGrade, setNewGrade] = useState('10');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('Student@123');

  // Edit Student Form State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrade, setEditGrade] = useState('10');
  const [editSchool, setEditSchool] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editIsActive, setEditIsActive] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/students?${params}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load students', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (student: Student) => {
    try {
      const nextStatus = !student.isActive;
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: student.id, isActive: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents(prev =>
          prev.map(s => s.id === student.id ? { ...s, isActive: nextStatus } : s)
        );
        toast({
          title: nextStatus ? 'Student Activated' : 'Student Suspended',
          description: `${student.name} is now ${nextStatus ? 'active' : 'suspended'}.`,
        });
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditPhone(student.phone || '');
    setEditGrade(student.student?.grade || '10');
    setEditSchool(student.student?.school || '');
    setEditCity(student.student?.city || '');
    setEditAvatar(student.avatar || null);
    setEditIsActive(student.isActive);
    setEditModalOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim() || null,
          avatar: editAvatar || null,
          grade: editGrade,
          school: editSchool.trim() || null,
          city: editCity.trim() || null,
          isActive: editIsActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Student Updated! ✨',
          description: `Changes for ${editName} have been successfully saved.`,
        });
        setEditModalOpen(false);
        fetchStudents();
      } else {
        throw new Error(data.error || 'Failed to update student');
      }
    } catch (err: any) {
      toast({ title: 'Update Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete student "${name}"? This will remove all their enrollments.`)) return;

    try {
      const res = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== id));
        toast({ title: 'Student Removed', description: `${name} has been deleted.` });
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast({ title: 'Missing details', description: 'Name and email are required', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_student',
          name: newName.trim(),
          email: newEmail.trim(),
          phone: newPhone.trim() || null,
          grade: `Class ${newGrade}`,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (newAvatar && data.data?.id) {
          await fetch('/api/admin/students', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.data.id, avatar: newAvatar }),
          });
        }

        toast({
          title: 'Student Created! 🎉',
          description: `Account created for ${newName}.`,
        });
        setModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewAvatar(null);
        fetchStudents();
      } else {
        throw new Error(data.error || 'Failed to add student');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Enrolled Students Directory
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage student accounts, photos, enrolled batches, and account access
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchStudents} title="Refresh" className="rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 app-tap"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Enroll New Student
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
            <p className="text-2xl font-bold text-slate-900">{students.length} Students</p>
            <p className="text-[11px] text-slate-400">Registered on platform</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Active Accounts</span>
            <p className="text-2xl font-bold text-emerald-600">
              {students.filter(s => s.isActive).length} Active
            </p>
            <p className="text-[11px] text-slate-400">Login permitted</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Enrollments</span>
            <p className="text-2xl font-bold text-brand-600">
              {students.reduce((acc, s) => acc + (s._count?.enrollments || 0), 0)} Courses
            </p>
            <p className="text-[11px] text-slate-400">Active curriculum access</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search student by name, email, or phone number..."
              className="pl-10 text-xs h-10 border-slate-200 rounded-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile View: Cards Grid for Native App Experience */}
        <div className="md:hidden space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 h-32 animate-pulse" />
            ))
          ) : students.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border">
              No students found.
            </div>
          ) : (
            students.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md overflow-hidden flex-shrink-0">
                      {s.avatar ? (
                        <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        s.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {s.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{s.email}</p>
                      <p className="text-[11px] text-brand-600 font-semibold">{s.phone || 'No Phone'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t text-slate-600">
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                    {s.student?.grade ? `Class ${s.student.grade}` : 'Class 10'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {s._count?.enrollments || 0} Courses
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(s)}
                    className="text-xs h-8 rounded-xl font-bold text-brand-600 border-brand-200 hover:bg-brand-50 app-tap"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStatus(s)}
                    className="text-xs h-8 rounded-xl"
                  >
                    {s.isActive ? 'Suspend' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(s.id, s.name)}
                    className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Student Table */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Student Details</th>
                  <th className="py-4 px-6">Grade / Class</th>
                  <th className="py-4 px-6">Courses Enrolled</th>
                  <th className="py-4 px-6">Registration Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden flex-shrink-0">
                            {s.avatar ? (
                              <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                            ) : (
                              s.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{s.email}</span>
                              {s.phone && <span>• {s.phone}</span>}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {s.student?.grade ? `Class ${s.student.grade}` : 'Class 10'}
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                          {s._count?.enrollments || 0} Courses
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(s.createdAt)}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          s.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {s.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(s)}
                            className="text-xs h-8 rounded-xl font-bold text-brand-600 border-brand-200 hover:bg-brand-50 app-tap"
                            title="Edit Student"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(s)}
                            className="text-xs h-8 rounded-xl"
                            title={s.isActive ? 'Suspend Access' : 'Activate Access'}
                          >
                            {s.isActive ? (
                              <UserX className="w-3.5 h-3.5 text-red-500 mr-1" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            )}
                            {s.isActive ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(s.id, s.name)}
                            className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 rounded-xl"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Enroll New Student */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Enroll New Student</h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <PhotoUpload
                  value={newAvatar}
                  onChange={setNewAvatar}
                  name={newName || 'Student'}
                  label="Student Photo"
                  size="md"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Aarav Sharma"
                    className="text-xs h-10 rounded-xl"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    required
                    type="email"
                    placeholder="student@example.com"
                    className="text-xs h-10 rounded-xl"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <Input
                    placeholder="+91 9934215013"
                    className="text-xs h-10 rounded-xl"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Grade / Class</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                      value={newGrade}
                      onChange={e => setNewGrade(e.target.value)}
                    >
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <Input
                      type="password"
                      placeholder="Student@123"
                      className="text-xs h-10 rounded-xl"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20">
                    Create Student Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Student */}
        {editModalOpen && editingStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Edit Student Profile</h3>
                  <p className="text-xs text-slate-400">Update academic details, photo, and access status</p>
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
                  name={editName || 'Student'}
                  label="Student Photo"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Grade / Class</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                      value={editGrade}
                      onChange={e => setEditGrade(e.target.value)}
                    >
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                      <option value="JEE">JEE Prep</option>
                      <option value="NEET">NEET Prep</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">School / Institution</label>
                    <Input
                      value={editSchool}
                      onChange={e => setEditSchool(e.target.value)}
                      placeholder="e.g. DPS R.K. Puram"
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City / Location</label>
                  <Input
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Account Access</p>
                    <p className="text-[11px] text-slate-400">Permit student to login and view courses</p>
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

      </div>
    </AdminLayout>
  );
}
