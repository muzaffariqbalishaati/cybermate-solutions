'use client';

import { ParentLayout } from '@/components/layouts/parent-layout';
import { BookOpen, CheckCircle2, Clock, Award } from 'lucide-react';

const coursesProgress = [
  {
    title: 'Class 10 Board Excellence - Mathematics & Science',
    completedLessons: 62,
    totalLessons: 84,
    percent: 74,
    status: 'Ahead of Pace',
    modules: [
      { name: 'Module 1: Chemical Reactions & Equations', status: 'Completed (100%)' },
      { name: 'Module 2: Light - Reflection and Refraction', status: 'In Progress (85%)' },
      { name: 'Module 3: Quadratic Equations & Arithmetic Progressions', status: 'In Progress (60%)' },
      { name: 'Module 4: Full Board Mock Examination Series', status: 'Scheduled for Nov' },
    ]
  },
  {
    title: 'Complete Chemistry Foundations for JEE / NEET',
    completedLessons: 30,
    totalLessons: 62,
    percent: 48,
    status: 'On Track',
    modules: [
      { name: 'Module 1: Atomic Structure & Quantum Numbers', status: 'Completed (100%)' },
      { name: 'Module 2: Periodic Classification & Trends', status: 'Completed (100%)' },
      { name: 'Module 3: Chemical Bonding & Molecular Geometry', status: 'In Progress (40%)' },
    ]
  }
];

export default function ParentProgressPage() {
  return (
    <ParentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Ward Course Progress & Syllabus Tracking
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time chapter completion tracking for Aarav Sharma
            </p>
          </div>
        </div>

        {/* Courses Detailed Progress */}
        <div className="space-y-6">
          {coursesProgress.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    {course.status}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {course.title}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 font-heading">
                    {course.percent}%
                  </span>
                  <p className="text-xs text-slate-400">
                    {course.completedLessons}/{course.totalLessons} Lessons Finished
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{ width: `${course.percent}%` }}
                />
              </div>

              {/* Module Checklist */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Chapter & Module Status:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {course.modules.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">{m.name}</span>
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </ParentLayout>
  );
}
