'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, CheckCircle2, Clock, Download, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  courseTitle: string;
  submittedAt: string;
  maxMarks: number;
  status: 'PENDING' | 'GRADED';
  awardedMarks?: number;
  remarks?: string;
}

const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    studentName: 'Aarav Sharma',
    assignmentTitle: 'Assignment 1: Balancing 20 Complex Chemical Equations',
    courseTitle: 'Class 10 Board Excellence',
    submittedAt: 'Today, 10:30 AM',
    maxMarks: 20,
    status: 'PENDING',
  },
  {
    id: 'sub-2',
    studentName: 'Pooja Verma',
    assignmentTitle: 'Assignment 2: Ray Diagrams & Spherical Mirrors',
    courseTitle: 'Class 10 Board Excellence',
    submittedAt: 'Yesterday',
    maxMarks: 25,
    status: 'PENDING',
  },
  {
    id: 'sub-3',
    studentName: 'Rohan Mehra',
    assignmentTitle: 'Assignment 2: Ray Diagrams & Spherical Mirrors',
    courseTitle: 'Class 10 Board Excellence',
    submittedAt: '3 days ago',
    maxMarks: 25,
    status: 'GRADED',
    awardedMarks: 24,
    remarks: 'Flawless ray diagrams and correct sign convention in numericals.',
  },
];

export default function TeacherAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [gradingSub, setGradingSub] = useState<Submission | null>(null);
  const [marks, setMarks] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marks || !gradingSub) return;

    setSubmissions(prev =>
      prev.map(s =>
        s.id === gradingSub.id
          ? {
              ...s,
              status: 'GRADED',
              awardedMarks: Number(marks),
              remarks: remarks || 'Good effort.',
            }
          : s
      )
    );

    setGradingSub(null);
    setMarks('');
    setRemarks('');
    toast({
      title: 'Grading Saved! 🌟',
      description: 'The student has received their grade and feedback remarks.',
    });
  };

  return (
    <TeacherLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Grade Student Assignments
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review submitted worksheets, provide marks, and leave feedback
            </p>
          </div>
        </div>

        {/* Modal: Grade Submission */}
        {gradingSub && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-start pb-3 border-b">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Grading: {gradingSub.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{gradingSub.assignmentTitle}</p>
                </div>
                <button onClick={() => setGradingSub(null)} className="text-slate-400 font-bold">✕</button>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Submitted PDF File (Pages 1-4)</span>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  View File
                </Button>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Marks Awarded (Out of {gradingSub.maxMarks}) *
                  </label>
                  <Input
                    type="number"
                    max={gradingSub.maxMarks}
                    min={0}
                    required
                    placeholder={`e.g. 19`}
                    className="text-xs h-10"
                    value={marks}
                    onChange={e => setMarks(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Teacher Remarks & Feedback</label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback or highlight errors..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setGradingSub(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Submit Grade
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Assignment</th>
                  <th className="py-3.5 px-6">Submitted At</th>
                  <th className="py-3.5 px-6">Status / Marks</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="py-4 px-6 text-slate-800 max-w-xs truncate">{sub.assignmentTitle}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">{sub.submittedAt}</td>
                    <td className="py-4 px-6">
                      {sub.status === 'GRADED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {sub.awardedMarks}/{sub.maxMarks} Marks
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          Needs Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        onClick={() => {
                          setGradingSub(sub);
                          setMarks(sub.awardedMarks ? String(sub.awardedMarks) : '');
                          setRemarks(sub.remarks || '');
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
                      >
                        {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade File'}
                      </Button>
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
