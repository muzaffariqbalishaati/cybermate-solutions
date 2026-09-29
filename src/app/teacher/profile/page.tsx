'use client';

import { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhotoUpload } from '@/components/ui/photo-upload';
import {
  User, Lock, Mail, Phone, GraduationCap, Award,
  Briefcase, Linkedin, ShieldCheck, CheckCircle2,
  BookOpen, Star, RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    name: 'Dr. Rajesh Kumar',
    email: 'teacher@cybermatesolutions.com',
    phone: '+91 9934215013',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    qualification: 'Ph.D. Mathematics, IIT Delhi',
    specialization: 'Mathematics & Advanced JEE',
    experience: 12,
    bio: 'Dedicated mathematics educator with over 12+ years of guiding students to top ranks in JEE Main and Advanced examinations.',
    linkedin: 'https://linkedin.com/in/cybermate-faculty',
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.data) {
        const u = data.data;
        setProfile({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '+91 9934215013',
          avatar: u.avatar || null,
          qualification: u.teacher?.qualification || 'M.Sc. Mathematics',
          specialization: u.teacher?.specialization || 'Science & Mathematics',
          experience: u.teacher?.experience || 8,
          bio: u.teacher?.bio || '',
          linkedin: u.teacher?.linkedin || '',
        });
      }
    } catch {
      // Fallback to initial state
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name.trim(),
          phone: profile.phone.trim() || null,
          avatar: profile.avatar || null,
          qualification: profile.qualification,
          specialization: profile.specialization,
          experience: profile.experience,
          bio: profile.bio,
          linkedin: profile.linkedin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Profile Updated! ✨',
          description: 'Your faculty profile and bio have been successfully saved.',
        });
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({ title: 'Invalid Password', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Mismatch', description: 'New password and confirm password do not match', variant: 'destructive' });
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Password Changed! 🔐', description: 'Your security password has been updated.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (err: any) {
      toast({ title: 'Password Update Failed', description: err.message, variant: 'destructive' });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Faculty Profile & Bio
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Customize your educator credentials, photo, subjects, and student visibility
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfile}
            disabled={loading}
            className="self-start sm:self-auto rounded-xl text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Experience</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{profile.experience}+ Years</p>
            <p className="text-[10px] text-brand-600 font-medium">Verified Mentor</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Teaching Rating</span>
            <p className="text-xl sm:text-2xl font-bold text-amber-500">4.9 / 5.0 ⭐</p>
            <p className="text-[10px] text-slate-400">Based on 1,400+ reviews</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Batches</span>
            <p className="text-xl sm:text-2xl font-bold text-brand-600">8 Active</p>
            <p className="text-[10px] text-slate-400">Live & video sessions</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</span>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">FACULTY</p>
            <p className="text-[10px] text-slate-400">CyberMate Solutions</p>
          </div>
        </div>

        {/* Main Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Photo & Identity Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm space-y-6">
            <div className="pb-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Educator Identity & Avatar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your photo and specialization are shown to students in course listings and live class sessions.
                </p>
              </div>
            </div>

            <PhotoUpload
              value={profile.avatar}
              onChange={newUrl => setProfile({ ...profile, avatar: newUrl || '' })}
              name={profile.name}
              size="lg"
              label="Educator Profile Picture"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <Input
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Official Email</label>
                <Input
                  disabled
                  value={profile.email}
                  className="rounded-xl h-11 text-sm bg-slate-50 text-slate-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                <Input
                  required
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 9934215013"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject Specialization *</label>
                <Input
                  required
                  value={profile.specialization}
                  onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                  placeholder="e.g. Mathematics, JEE Advanced, Physics"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Academic Credentials & Bio */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              Academic Credentials & Bio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Highest Qualification</label>
                <Input
                  value={profile.qualification}
                  onChange={e => setProfile({ ...profile, qualification: e.target.value })}
                  placeholder="e.g. Ph.D. Mathematics, IIT Delhi"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Teaching Experience (Years)</label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={profile.experience}
                  onChange={e => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">LinkedIn / Portfolio URL</label>
                <Input
                  value={profile.linkedin}
                  onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">About Me / Teaching Philosophy</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Introduce yourself to prospective students, highlight your previous results, key methodology, and success stories..."
                  className="w-full p-3.5 rounded-2xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-brand-500/25 app-tap text-sm"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </div>
        </form>

        {/* Security & Password Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600" />
            Security & Password Change
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Password (optional for verification)</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="rounded-xl h-11 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password *</label>
                <Input
                  required
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm New Password *</label>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={passwordSaving}
              variant="outline"
              className="rounded-2xl h-11 px-6 font-bold text-xs hover:bg-slate-50 app-tap"
            >
              {passwordSaving ? 'Updating...' : 'Update Password 🔐'}
            </Button>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
}
