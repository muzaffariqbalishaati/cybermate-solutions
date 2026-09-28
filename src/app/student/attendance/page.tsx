'use client';

import { StudentLayout } from '@/components/layouts/student-layout';
import {
  Calendar, CheckCircle2, XCircle, Clock,
  TrendingUp, Award, AlertCircle
} from 'lucide-react';

const mockAttendanceLog = [
  { date: '26 Sept 2026', classTitle: 'Optics Ray Diagrams Live Masterclass', subject: 'Physics', status: 'PRESENT', duration: '90 mins' },
  { date: '25 Sept 2026', classTitle: 'Balancing Chemical Equations Problem Set', subject: 'Chemistry', status: 'PRESENT', duration: '75 mins' },
  { date: '24 Sept 2026', classTitle: 'Quadratic Equations Speed Drill', subject: 'Mathematics', status: 'PRESENT', duration: '60 mins' },
  { date: '22 Sept 2026', classTitle: 'Chemical Bonding Live Q&A', subject: 'Chemistry', status: 'ABSENT', duration: '80 mins' },
  { date: '21 Sept 2026', classTitle: 'Light Reflection Laws Demonstration', subject: 'Physics', status: 'PRESENT', duration: '90 mins' },
  { date: '19 Sept 2026', classTitle: 'Arithmetic Progression Fundamentals', subject: 'Mathematics', status: 'PRESENT', duration: '70 mins' },
];

export default function StudentAttendancePage() {
  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Live Class Attendance
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monthly attendance record for live interactive tuition batches
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
            <p className="text-3xl font-heading font-black text-emerald-600">95.8%</p>
            <p className="text-xs text-slate-500">Above 85% requirement</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Classes</p>
            <p className="text-3xl font-heading font-black text-slate-900">48</p>
            <p className="text-xs text-slate-500">Conducted this term</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attended</p>
            <p className="text-3xl font-heading font-black text-emerald-600">46</p>
            <p className="text-xs text-slate-500">Full participation</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Absences</p>
            <p className="text-3xl font-heading font-black text-slate-400">2</p>
            <p className="text-xs text-slate-500">Watch recordings</p>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Recent Attendance History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Class Title</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAttendanceLog.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">{log.date}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{log.classTitle}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                        {log.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{log.duration}</td>
                    <td className="py-4 px-6">
                      {log.status === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
