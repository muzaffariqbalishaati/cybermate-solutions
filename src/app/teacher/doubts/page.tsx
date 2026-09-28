'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import {
  HelpCircle, MessageSquare, CheckCircle2, Clock,
  Send, User, Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Doubt {
  id: string;
  studentName: string;
  courseTitle: string;
  chapter: string;
  question: string;
  time: string;
  status: 'PENDING' | 'RESOLVED';
  answer?: string;
}

const initialDoubts: Doubt[] = [
  {
    id: 'd-101',
    studentName: 'Aarav Sharma',
    courseTitle: 'Class 10 Board Excellence',
    chapter: 'Chemical Reactions and Equations',
    question: 'In the reaction CuO + H2 -> Cu + H2O, which substance is oxidized and which is the oxidizing agent?',
    time: '3 hours ago',
    status: 'PENDING',
  },
  {
    id: 'd-102',
    studentName: 'Sneha Patel',
    courseTitle: 'Class 10 Board Excellence',
    chapter: 'Light - Reflection and Refraction',
    question: 'How do we calculate magnification when the image is virtual and erect?',
    time: '5 hours ago',
    status: 'PENDING',
  },
  {
    id: 'd-103',
    studentName: 'Rohan Mehra',
    courseTitle: 'Class 10 Board Excellence',
    chapter: 'Quadratic Equations',
    question: 'Why do concave mirrors have a real focal point while convex mirrors have a virtual focus?',
    time: 'Yesterday',
    status: 'RESOLVED',
    answer: 'Because reflected rays physically intersect at the focal point for a concave mirror, it forms real images that can be captured on a screen.',
  },
];

export default function TeacherDoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts);
  const [answeringDoubt, setAnsweringDoubt] = useState<Doubt | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !answeringDoubt) return;

    setDoubts(prev =>
      prev.map(d =>
        d.id === answeringDoubt.id
          ? { ...d, status: 'RESOLVED', answer: replyText }
          : d
      )
    );

    setAnsweringDoubt(null);
    setReplyText('');
    toast({
      title: 'Response Sent! 📬',
      description: 'The student has been notified with your solution.',
    });
  };

  return (
    <TeacherLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Student Doubts Resolution Queue
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review and answer academic doubts asked by your enrolled students
            </p>
          </div>
        </div>

        {/* Modal: Answer Doubt */}
        {answeringDoubt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-start pb-3 border-b">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                    {answeringDoubt.chapter}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Asked by {answeringDoubt.studentName}</p>
                </div>
                <button onClick={() => setAnsweringDoubt(null)} className="text-slate-400 font-bold">✕</button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border text-sm text-slate-800">
                <p className="font-semibold text-xs text-slate-500 mb-1">Student's Question:</p>
                {answeringDoubt.question}
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Your Step-by-Step Faculty Solution *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write a clear conceptual explanation, formulas or chemical equations..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAnsweringDoubt(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Send Answer to Student
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Doubts Queue */}
        <div className="space-y-4">
          {doubts.map(d => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {d.chapter}
                  </span>
                  <span className="text-xs text-slate-400">• Student: <span className="font-semibold text-slate-700">{d.studentName}</span></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {d.status === 'RESOLVED' ? '✓ Resolved' : '● Needs Answer'}
                  </span>
                  <span className="text-xs text-slate-400">{d.time}</span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{d.question}"
              </p>

              {d.answer ? (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-emerald-800">Your Answer:</p>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">{d.answer}</p>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => {
                      setAnsweringDoubt(d);
                      setReplyText('');
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    Answer Doubt Now
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </TeacherLayout>
  );
}
