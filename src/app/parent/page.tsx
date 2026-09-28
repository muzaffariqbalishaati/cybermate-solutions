'use client';

import { ParentLayout } from '@/components/layouts/parent-layout';
import Link from 'next/link';
import {
  TrendingUp, Calendar, FileText, CheckCircle2,
  Award, Clock, ArrowRight, ShieldCheck, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentDashboardPage() {
  return (
    <ParentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Child Header Overview */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
              Linked Ward Academic Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Aarav Sharma's Learning Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Class 10 CBSE • Roll No: EP-1001 • Enrolled in 3 Courses
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl text-center flex-shrink-0">
            <p className="text-2xl font-heading font-black text-emerald-400">91.4%</p>
            <p className="text-[11px] text-slate-300 font-medium">Term Aggregate Score</p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</p>
            <p className="text-3xl font-heading font-black text-emerald-600">95.8%</p>
            <p className="text-xs text-slate-500">46 of 48 live lectures</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Progress</p>
            <p className="text-3xl font-heading font-black text-brand-600">74%</p>
            <p className="text-xs text-slate-500">Ahead of school schedule</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignments</p>
            <p className="text-3xl font-heading font-black text-slate-900">100%</p>
            <p className="text-xs text-slate-500">All submissions on time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tests Taken</p>
            <p className="text-3xl font-heading font-black text-purple-600">12</p>
            <p className="text-xs text-slate-500">Avg accuracy 91%</p>
          </div>
        </div>

        {/* Recent Teacher Feedback & Recent Test Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Teacher Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Latest Teacher Remarks
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">Dr. Rajesh Verma (Physics)</span>
                  <span className="text-slate-400">2 days ago</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Aarav demonstrates strong grasping power in numerical problem-solving. His ray diagrams in yesterday's assignment were among the cleanest in the batch. Encouraged to maintain this pace for the upcoming pre-boards."
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">Prof. Vikram Malhotra (Mathematics)</span>
                  <span className="text-slate-400">1 week ago</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Active participation in live doubt solving. Needs a little more practice on speed for quadratic word problems, but conceptual clarity is solid."
                </p>
              </div>
            </div>
          </div>

          {/* Recent Assessment Scores */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Recent Test Scores
              </h2>
              <Link href="/parent/reports" className="text-xs font-semibold text-purple-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Chapter 1: Chemical Reactions & Equations', date: '25 Sept 2026', score: '20/20 (100%)', status: 'Distinction' },
                { title: 'Optics & Spherical Mirrors Speed Quiz', date: '20 Sept 2026', score: '14/15 (93%)', status: 'Grade A+' },
                { title: 'Quadratic Equations Mid-Module Test', date: '14 Sept 2026', score: '22/25 (88%)', status: 'Grade A' },
              ].map((test, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{test.title}</p>
                    <p className="text-[11px] text-slate-400">{test.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{test.score}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </ParentLayout>
  );
}
