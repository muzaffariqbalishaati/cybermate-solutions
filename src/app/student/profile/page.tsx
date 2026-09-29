'use client';

import { useState } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, Phone, Mail, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Aarav Sharma',
    email: 'student@cybermatesolutions.com',
    phone: '+91 98765 43210',
    grade: 'Class 10',
    school: 'Delhi Public School, R.K. Puram',
    parentName: 'Sanjay Sharma',
    parentPhone: '+91 98765 43219',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Profile Updated! ✨',
        description: 'Your details have been successfully saved.',
      });
    }, 1000);
  };

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Student Profile & Account Settings
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage personal info, parent guardian contacts, and security credentials
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Student Academic Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input
                  disabled
                  value={profile.email}
                  className="bg-slate-50 text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                <Input
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Grade / Standard</label>
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
                  value={profile.grade}
                  onChange={e => setProfile({ ...profile, grade: e.target.value })}
                >
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11 Science</option>
                  <option>Class 12 Science</option>
                  <option>JEE Preparation</option>
                  <option>NEET Preparation</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">School / Institution Name</label>
                <Input
                  value={profile.school}
                  onChange={e => setProfile({ ...profile, school: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Parent Guardian Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b flex items-center gap-2">
              <Phone className="w-5 h-5 text-brand-600" />
              Parent / Guardian Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Parent / Guardian Name</label>
                <Input
                  value={profile.parentName}
                  onChange={e => setProfile({ ...profile, parentName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Parent Mobile (for SMS reports)</label>
                <Input
                  value={profile.parentPhone}
                  onChange={e => setProfile({ ...profile, parentPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-8 shadow-lg shadow-brand-500/20"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>

      </div>
    </StudentLayout>
  );
}
