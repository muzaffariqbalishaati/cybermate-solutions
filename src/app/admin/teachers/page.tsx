'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Star, BookOpen, Mail, Phone, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  assignedCourses: number;
  rating: number;
  email: string;
  avatar: string;
}

const mockTeachers: Teacher[] = [
  {
    id: 't-1',
    name: 'Dr. Rajesh Verma',
    specialization: 'Physics & Engineering Mechanics',
    experience: '15+ Years (Ex-IIT Roorkee)',
    assignedCourses: 2,
    rating: 4.9,
    email: 'rajesh.verma@edupro.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 't-2',
    name: 'Prof. Vikram Malhotra',
    specialization: 'Pure Mathematics & Calculus',
    experience: '18+ Years (ISI Kolkata)',
    assignedCourses: 3,
    rating: 4.8,
    email: 'vikram.m@edupro.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 't-3',
    name: 'Meenakshi Iyer',
    specialization: 'Organic & Physical Chemistry',
    experience: '10+ Years (Delhi University)',
    assignedCourses: 2,
    rating: 4.9,
    email: 'meenakshi.i@edupro.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 't-4',
    name: 'Dr. Ananya Sen',
    specialization: 'Biology & NEET Physiology',
    experience: '12+ Years (AIIMS Alum)',
    assignedCourses: 1,
    rating: 4.9,
    email: 'ananya.s@edupro.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
];

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      name,
      specialization: specialization || 'General Science',
      experience: experience || '5+ Years',
      assignedCourses: 1,
      rating: 5.0,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };

    setTeachers([newTeacher, ...teachers]);
    setModalOpen(false);
    setName('');
    setSpecialization('');
    setEmail('');
    toast({
      title: 'Faculty Added! 👨‍🏫',
      description: 'Teacher profile created and portal access granted.',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Faculty Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage expert educators, course allocations, and teaching credentials
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Educator
          </Button>
        </div>

        {/* Modal: Add Faculty */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Add Faculty Member</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Educator Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Dr. Kavita Sharma"
                    className="text-xs h-10"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Specialization & Subject *</label>
                  <Input
                    required
                    placeholder="e.g. Inorganic Chemistry & NEET"
                    className="text-xs h-10"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Qualifications & Experience</label>
                  <Input
                    placeholder="e.g. Ph.D. IIT Delhi, 12+ Yrs Exp"
                    className="text-xs h-10"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="kavita@edupro.com"
                    className="text-xs h-10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Add Educator
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teachers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 space-y-4 text-center flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-brand-500 shadow-md">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                  <p className="text-xs font-semibold text-brand-600 mt-0.5">{t.specialization}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{t.experience}</p>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{t.rating} Faculty Rating</span>
                </div>
              </div>

              <div className="pt-3 border-t text-xs text-slate-500 flex justify-between items-center">
                <span>{t.assignedCourses} Assigned Batches</span>
                <span className="font-semibold text-slate-800">Active</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
