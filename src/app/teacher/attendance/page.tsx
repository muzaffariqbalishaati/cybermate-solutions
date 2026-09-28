'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, XCircle, Clock, Save, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentRow {
  id: string;
  name: string;
  rollNo: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

const initialStudents: StudentRow[] = [
  { id: 's1', name: 'Aarav Sharma', rollNo: 'EP-1001', status: 'PRESENT' },
  { id: 's2', name: 'Pooja Verma', rollNo: 'EP-1002', status: 'PRESENT' },
  { id: 's3', name: 'Rohan Mehra', rollNo: 'EP-1003', status: 'PRESENT' },
  { id: 's4', name: 'Sneha Patel', rollNo: 'EP-1004', status: 'ABSENT' },
  { id: 's5', name: 'Karan Singhania', rollNo: 'EP-1005', status: 'PRESENT' },
  { id: 's6', name: 'Ananya Gupta', rollNo: 'EP-1006', status: 'LATE' },
];

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [selectedBatch, setSelectedBatch] = useState('Class 10 Board Excellence - Batch A');

  const setStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSave = () => {
    toast({
      title: 'Attendance Saved! 📋',
      description: 'Records synced with student and parent portals.',
    });
  };

  const presentCount = students.filter(s => s.status === 'PRESENT').length;

  return (
    <TeacherLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Batch Attendance Sheet
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Mark live class participation and sync reports directly with parent accounts
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-6 shadow-lg shadow-brand-500/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Today's Attendance
          </Button>
        </div>

        {/* Batch Selector & Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Class Batch</label>
            <select
              className="w-full sm:w-80 h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white"
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
            >
              <option>Class 10 Board Excellence - Batch A</option>
              <option>Complete Chemistry Foundations - Batch B</option>
            </select>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <span className="text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Present: {presentCount}
            </span>
            <span className="text-red-600 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Absent: {students.length - presentCount}
            </span>
          </div>
        </div>

        {/* Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Roll No</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6 text-center">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800">{s.rollNo}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{s.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setStatus(s.id, 'PRESENT')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'LATE')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'ABSENT')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === 'ABSENT'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </TeacherLayout>
  );
}
