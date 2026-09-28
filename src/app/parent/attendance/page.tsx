'use client';

import { ParentLayout } from '@/components/layouts/parent-layout';
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

const mockWardAttendance = [
  { date: '26 Sept 2026', title: 'Optics Ray Diagrams Live Masterclass', subject: 'Physics', time: '5:00 PM', status: 'PRESENT' },
  { date: '25 Sept 2026', title: 'Balancing Chemical Equations Problem Set', subject: 'Chemistry', time: '4:30 PM', status: 'PRESENT' },
  { date: '24 Sept 2026', title: 'Quadratic Equations Speed Drill', subject: 'Mathematics', time: '6:00 PM', status: 'PRESENT' },
  { date: '22 Sept 2026', title: 'Chemical Bonding Live Q&A', subject: 'Chemistry', time: '5:00 PM', status: 'ABSENT', note: 'Medical Leave noted' },
  { date: '21 Sept 2026', title: 'Light Reflection Laws Demonstration', subject: 'Physics', time: '5:00 PM', status: 'PRESENT' },
];

export default function ParentAttendancePage() {
  return (
    <ParentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Ward Attendance Tracking
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Live session attendance logs for Aarav Sharma
            </p>
          </div>
        </div>

        {/* Attendance Score Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
              Satisfactory Standing (Above 85%)
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              95.8% Overall Term Attendance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Attended 46 out of 48 live classes conducted this semester.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl">
              46
            </div>
            <div className="text-xs text-slate-600">
              <p className="font-bold text-slate-900">Lectures Attended</p>
              <p className="text-slate-400">2 recorded classes watched</p>
            </div>
          </div>
        </div>

        {/* Table of logs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Class Title</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockWardAttendance.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">{log.date}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{log.title}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                        {log.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {log.status === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Absent ({log.note || 'No note'})
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
    </ParentLayout>
  );
}
