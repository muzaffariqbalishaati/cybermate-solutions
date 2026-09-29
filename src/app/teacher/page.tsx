'use client';

import { TeacherLayout } from '@/components/layouts/teacher-layout';
import Link from 'next/link';
import {
  Users, BookOpen, Video, HelpCircle, FileText,
  Clock, ArrowRight, PlayCircle, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeacherDashboardPage() {
  return (
    <TeacherLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-5 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full">
              Teacher Faculty Portal
            </span>
            <h1 className="text-xl sm:text-3xl font-heading font-extrabold text-white">
              Welcome back, Faculty! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              You have 1 live class scheduled today and 4 student doubts awaiting resolution.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/teacher/live-classes">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-4 px-5 rounded-2xl shadow-lg shadow-red-500/25 app-tap">
                <Video className="w-4 h-4 mr-2" />
                Live Studio
              </Button>
            </Link>
            <Link href="/teacher/profile">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-xs py-4 px-4 rounded-2xl app-tap">
                Edit Bio 👤
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:hidden">
          <Link
            href="/teacher/live-classes"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Sessions
          </Link>
          <Link
            href="/teacher/courses"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>📚</span> My Batches
          </Link>
          <Link
            href="/teacher/doubts"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>❓</span> Doubts Queue
          </Link>
          <Link
            href="/teacher/profile"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>👤</span> My Profile
          </Link>
        </div>

        {/* Faculty Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">4</p>
            <p className="text-xs text-slate-500 font-medium">Assigned Batches</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">1,248</p>
            <p className="text-xs text-slate-500 font-medium">Enrolled Students</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-amber-600">4</p>
            <p className="text-xs text-slate-500 font-medium">Doubts in Queue</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">9</p>
            <p className="text-xs text-slate-500 font-medium">Ungraded Submissions</p>
          </div>
        </div>

        {/* Today's Schedule & Quick Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Today's Classes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                Today's Teaching Schedule
              </h2>
              <Link href="/teacher/live-classes" className="text-xs font-semibold text-brand-600 hover:underline">
                View all sessions →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold uppercase text-red-600">Upcoming at 5:00 PM</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Optics & Ray Diagrams Masterclass
                  </h3>
                  <p className="text-xs text-slate-500">
                    Class 10 Board Excellence • 90 Mins • 42 Students Expected
                  </p>
                </div>

                <Link href="/teacher/live-classes">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
                    Start Session
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-500">Tomorrow at 6:00 PM</span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Quadratic Equations - Problem Solving Drill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Class 10 Board Excellence • 75 Mins
                  </p>
                </div>

                <Button variant="outline" className="text-xs font-semibold">
                  Prepare Materials
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b">
              Faculty Actions
            </h2>

            <div className="space-y-2.5">
              <Link href="/teacher/doubts" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-800">Answer Student Doubts</p>
                      <p className="text-[10px] text-slate-400">4 questions pending</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/teacher/assignments" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-bold text-slate-800">Review Homework Files</p>
                      <p className="text-[10px] text-slate-400">9 new uploads</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/teacher/attendance" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-800">Mark Batch Attendance</p>
                      <p className="text-[10px] text-slate-400">Update today's records</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </TeacherLayout>
  );
}
