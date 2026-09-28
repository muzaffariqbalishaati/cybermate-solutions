'use client';

import { StudentLayout } from '@/components/layouts/student-layout';
import {
  BarChart3, TrendingUp, Award, Target, CheckCircle2,
  AlertTriangle, BookOpen, Clock, Calendar
} from 'lucide-react';

export default function StudentPerformancePage() {
  const subjects = [
    { name: 'Mathematics', score: 96, testsTaken: 8, color: 'bg-emerald-500' },
    { name: 'Physics', score: 92, testsTaken: 10, color: 'bg-blue-500' },
    { name: 'Chemistry', score: 86, testsTaken: 7, color: 'bg-purple-500' },
    { name: 'Biology', score: 90, testsTaken: 6, color: 'bg-amber-500' },
  ];

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Performance & Academic Analytics
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Detailed tracking of your test scores, chapter strengths, and growth metrics
            </p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">91.4%</p>
            <p className="text-xs text-slate-500 font-medium">Overall Average Score</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-emerald-600">+8.2%</p>
            <p className="text-xs text-slate-500 font-medium">Improvement this Month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">31</p>
            <p className="text-xs text-slate-500 font-medium">Assessments Completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-3xl font-heading font-black text-slate-900">95.6%</p>
            <p className="text-xs text-slate-500 font-medium">Live Class Attendance</p>
          </div>
        </div>

        {/* Subject-Wise Mastery */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Subject-wise Concept Mastery
          </h2>

          <div className="space-y-5">
            {subjects.map(s => (
              <div key={s.name} className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-xs text-slate-500">
                    <span className="font-bold text-slate-900 text-sm">{s.score}%</span> average ({s.testsTaken} tests)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              Key Strengths (Top Scoring Topics)
            </div>
            <div className="space-y-3">
              {[
                { topic: 'Quadratic Equations & Roots', accuracy: '98% Accuracy' },
                { topic: 'Optics - Spherical Mirrors & Ray Diagrams', accuracy: '95% Accuracy' },
                { topic: 'Cell Division & Heredity', accuracy: '94% Accuracy' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-950">{item.topic}</span>
                  <span className="font-bold text-emerald-700">{item.accuracy}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              Recommended Focus Areas (Practice Needed)
            </div>
            <div className="space-y-3">
              {[
                { topic: 'Redox & Chemical Displacement Balancing', tip: 'Revise 10 practice equations' },
                { topic: 'Arithmetic Progression Word Problems', tip: 'Re-watch Lecture 3.4' },
                { topic: 'Refraction through Prisms & Dispersion', tip: 'Attempt Chapter Quiz 2' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-amber-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-amber-950">{item.topic}</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">{item.tip}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                    Action
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </StudentLayout>
  );
}
