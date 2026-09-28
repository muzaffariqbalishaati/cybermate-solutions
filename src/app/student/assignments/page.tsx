'use client';

import { useState } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import {
  FileText, UploadCloud, CheckCircle2, Clock,
  AlertCircle, Download, ArrowRight, Star, Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  course: string;
  dueDate: string;
  maxMarks: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  obtainedMarks?: number;
  teacherRemarks?: string;
  instructions: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Assignment 1: Balancing 20 Complex Chemical Equations',
    subject: 'Chemistry',
    course: 'Class 10 Board Excellence',
    dueDate: 'In 2 days (30 Sept 2026)',
    maxMarks: 20,
    status: 'PENDING',
    instructions: 'Solve all 20 redox and decomposition equations step-by-step on paper, scan into a single PDF, and upload below.',
  },
  {
    id: 'asg-2',
    title: 'Assignment 2: Ray Diagrams and Numerical Problems on Convex Lenses',
    subject: 'Physics',
    course: 'Class 10 Board Excellence',
    dueDate: 'Submitted on 22 Sept',
    maxMarks: 25,
    status: 'GRADED',
    obtainedMarks: 24,
    teacherRemarks: 'Excellent precision in ray diagrams and sign convention. Just remember to always mention unit in focal length answer.',
    instructions: 'Draw ray diagrams for objects placed at 2F1, between F1 and 2F1, and at F1.',
  },
  {
    id: 'asg-3',
    title: 'Assignment 3: Real Life Quadratic Word Problems Worksheet',
    subject: 'Mathematics',
    course: 'Class 10 Board Excellence',
    dueDate: 'Submitted on 25 Sept',
    maxMarks: 20,
    status: 'SUBMITTED',
    instructions: 'Solve questions 1 through 15 from Chapter 4 worksheet.',
  },
];

export default function StudentAssignmentsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [submittingAsg, setSubmittingAsg] = useState<Assignment | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filtered = mockAssignments.filter(a => filter === 'ALL' || a.status === filter);

  const handleSubmitFile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (submittingAsg) {
        submittingAsg.status = 'SUBMITTED';
      }
      setSubmittingAsg(null);
      toast({
        title: 'Assignment Submitted! 📄',
        description: 'Your teacher will review and grade your solution shortly.',
      });
    }, 1200);
  };

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Assignments & Homework
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Submit practice sheets and review personalized teacher evaluations
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 border-b pb-4 overflow-x-auto">
          {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Submission Modal */}
        {submittingAsg && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                    {submittingAsg.subject}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mt-2">
                    {submittingAsg.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSubmittingAsg(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitFile} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:border-brand-500 cursor-pointer bg-slate-50">
                  <UploadCloud className="w-10 h-10 text-brand-600 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Click to browse or drag & drop assignment file
                  </p>
                  <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 25MB</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Notes / Remarks for Teacher</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Completed all 20 questions. Checked calculation for Q14 twice."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSubmittingAsg(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    {isUploading ? 'Uploading...' : 'Confirm Submission'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(asg => (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full">
                    {asg.subject}
                  </span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                    asg.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : asg.status === 'GRADED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {asg.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {asg.instructions}
                </p>

                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>

              {/* Status Specific Section */}
              <div className="pt-3 border-t space-y-3">
                {asg.status === 'GRADED' && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-900">Score: {asg.obtainedMarks}/{asg.maxMarks}</span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-200/60 px-2 py-0.5 rounded">
                        Grade A+
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 italic leading-snug">
                      "{asg.teacherRemarks}"
                    </p>
                  </div>
                )}

                {asg.status === 'PENDING' && (
                  <Button
                    onClick={() => setSubmittingAsg(asg)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-5"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Submit Solution
                  </Button>
                )}

                {asg.status === 'SUBMITTED' && (
                  <div className="text-center py-2 text-xs text-blue-600 font-semibold bg-blue-50 rounded-xl border border-blue-100">
                    ✓ Solution Uploaded • Awaiting Teacher Grade
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
}
