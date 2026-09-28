'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap, Search, Plus, CheckCircle2,
  XCircle, Mail, Phone, BookOpen, ShieldCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  enrolledCourses: number;
  joinedDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const mockStudents: Student[] = [
  { id: 'st-1', name: 'Aarav Sharma', email: 'aarav@gmail.com', phone: '+91 98765 43210', grade: 'Class 10', enrolledCourses: 3, joinedDate: '10 Jan 2026', status: 'ACTIVE' },
  { id: 'st-2', name: 'Pooja Verma', email: 'pooja.v@gmail.com', phone: '+91 98765 43211', grade: 'Class 10', enrolledCourses: 2, joinedDate: '15 Jan 2026', status: 'ACTIVE' },
  { id: 'st-3', name: 'Rohan Mehra', email: 'rohan.m@gmail.com', phone: '+91 98765 43212', grade: 'Class 11 Science', enrolledCourses: 4, joinedDate: '02 Feb 2026', status: 'ACTIVE' },
  { id: 'st-4', name: 'Sneha Patel', email: 'sneha.p@gmail.com', phone: '+91 98765 43213', grade: 'Class 12 Science', enrolledCourses: 1, joinedDate: '20 Feb 2026', status: 'ACTIVE' },
  { id: 'st-5', name: 'Karan Singhania', email: 'karan.s@gmail.com', phone: '+91 98765 43214', grade: 'Class 9', enrolledCourses: 2, joinedDate: '01 Mar 2026', status: 'ACTIVE' },
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGrade, setNewGrade] = useState('Class 10');

  const filtered = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : s
      )
    );
    toast({ title: 'Student Status Updated' });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+91 98765 00000',
      grade: newGrade,
      enrolledCourses: 1,
      joinedDate: 'Just now',
      status: 'ACTIVE',
    };

    setStudents([newStudent, ...students]);
    setModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    toast({
      title: 'Student Enrolled! 🎓',
      description: 'Account created and credentials emailed.',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Student Directory & Enrollment
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage student accounts, enrolled batches, and account access
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Enroll New Student
          </Button>
        </div>

        {/* Modal: Enroll Student */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Enroll New Student</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Meera Joshi"
                    className="text-xs h-10"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="meera@example.com"
                    className="text-xs h-10"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mobile Phone</label>
                  <Input
                    placeholder="+91 98765 43210"
                    className="text-xs h-10"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Grade / Standard</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                  >
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11 Science</option>
                    <option>Class 12 Science</option>
                    <option>JEE Preparation</option>
                    <option>NEET Preparation</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Enroll Student
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <Input
              placeholder="Search by student name or email..."
              className="pl-9 text-xs sm:text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <p className="text-xs text-slate-500 font-semibold">
            {filtered.length} Total Enrolled Students
          </p>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Grade</th>
                  <th className="py-3.5 px-6">Phone</th>
                  <th className="py-3.5 px-6">Courses</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                        {student.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">{student.phone}</td>
                    <td className="py-4 px-6 text-xs font-bold text-slate-800">
                      {student.enrolledCourses} Courses
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">{student.joinedDate}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(student.id)}
                        className="text-xs"
                      >
                        {student.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
