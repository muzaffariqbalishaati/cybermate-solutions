'use client';

import { ParentLayout } from '@/components/layouts/parent-layout';
import { Award, Download, Printer, CheckCircle2, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentReportsPage() {
  const report = {
    term: 'Mid-Term Academic Assessment 2026',
    studentName: 'Aarav Sharma',
    rollNo: 'EP-1001',
    grade: 'Class 10 CBSE',
    overallPercentage: 91.4,
    finalGrade: 'A+ (Distinction)',
    subjects: [
      { name: 'Mathematics', maxMarks: 100, scored: 96, grade: 'A1', remarks: 'Exceptional analytical ability' },
      { name: 'Physics', maxMarks: 100, scored: 92, grade: 'A1', remarks: 'Strong conceptual clarity & diagrams' },
      { name: 'Chemistry', maxMarks: 100, scored: 86, grade: 'A2', remarks: 'Good grasp, practice redox balancing' },
      { name: 'Biology', maxMarks: 100, scored: 90, grade: 'A1', remarks: 'Accurate terminology and definitions' },
    ],
    facultyRemarks: 'Aarav has been a consistent performer across all modules. His doubt participation and homework punctuality reflect high dedication. He is on track for 95%+ in the final board exams.',
  };

  return (
    <ParentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Official Academic Report Card
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Terminal performance scorecard issued by CyberMate Solutions Academic Board
            </p>
          </div>

          <Button
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report Card
          </Button>
        </div>

        {/* Report Card Document */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl space-y-8">
          
          {/* Institution Header */}
          <div className="text-center pb-6 border-b space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              CyberMate Solutions Learning Foundation
            </h2>
            <p className="text-xs uppercase tracking-widest text-purple-600 font-bold">
              Formal Student Progress Evaluation
            </p>
            <p className="text-xs text-slate-400">{report.term}</p>
          </div>

          {/* Student Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border text-xs">
            <div>
              <p className="text-slate-400 font-semibold">Student Name:</p>
              <p className="text-sm font-bold text-slate-900">{report.studentName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Roll Number:</p>
              <p className="text-sm font-bold text-slate-900">{report.rollNo}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Class / Stream:</p>
              <p className="text-sm font-bold text-slate-900">{report.grade}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Final Grade:</p>
              <p className="text-sm font-bold text-emerald-600">{report.finalGrade}</p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600 border-b">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Max Marks</th>
                  <th className="py-3 px-4 text-center">Marks Scored</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.subjects.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-center text-slate-500">{s.maxMarks}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{s.scored}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{s.grade}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{s.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Aggregate */}
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase font-bold text-purple-700">Cumulative Aggregate:</p>
              <p className="text-2xl font-black font-heading text-purple-900">
                {report.overallPercentage}% (Distinction)
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Eligible for CyberMate Solutions Merit Scholar Certificate
            </div>
          </div>

          {/* Faculty Summary Remarks */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Principal & Faculty Remarks:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic p-4 bg-slate-50 rounded-2xl border">
              "{report.facultyRemarks}"
            </p>
          </div>

        </div>

      </div>
    </ParentLayout>
  );
}
