'use client';

import { useState } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HelpCircle, MessageSquare, Plus, CheckCircle2,
  Clock, Search, User, Send, Sparkles, Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Doubt {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  description: string;
  createdAt: string;
  status: 'PENDING' | 'ANSWERED';
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

const mockDoubts: Doubt[] = [
  {
    id: 'd-1',
    title: 'Why do concave mirrors have a real focal point while convex mirrors have a virtual focus?',
    subject: 'Physics',
    chapter: 'Light - Reflection and Refraction',
    description: 'When parallel light rays strike a concave mirror, they actually intersect at the focus in front of the mirror. But for convex mirrors they appear to diverge from a point behind the mirror. Is this why concave mirror images can be cast on a screen?',
    createdAt: 'Yesterday, 3:15 PM',
    status: 'ANSWERED',
    answer: 'Exactly right, Rohan! Because reflected rays physically intersect at the focal point for a concave mirror, it forms real images that can be captured on a screen. In convex mirrors, the rays diverge and only appear to meet when extended backwards behind the reflective surface, making the focus virtual.',
    answeredBy: 'Dr. Rajesh Verma (Senior Physics Faculty)',
    answeredAt: 'Yesterday, 4:20 PM',
  },
  {
    id: 'd-2',
    title: 'Doubt in finding discriminant when coefficients contain square roots',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    description: 'In equation √3x² + 10x + 7√3 = 0, how do we systematically calculate b² - 4ac without calculation mistakes?',
    createdAt: '2 days ago',
    status: 'ANSWERED',
    answer: 'Here a = √3, b = 10, c = 7√3. So b² = 100. 4ac = 4 * (√3) * (7√3) = 4 * 7 * 3 = 84. Therefore D = 100 - 84 = 16. Since D > 0 and a perfect square (4²), the roots are real, rational and distinct: x = (-10 ± 4)/(2√3).',
    answeredBy: 'Prof. Vikram Malhotra (Mathematics Faculty)',
    answeredAt: '2 days ago',
  },
  {
    id: 'd-3',
    title: 'Clarification on oxidation vs oxidizing agent definition',
    subject: 'Chemistry',
    chapter: 'Chemical Reactions and Equations',
    description: 'In the reaction CuO + H2 -> Cu + H2O, which substance is oxidized and which is the oxidizing agent?',
    createdAt: '3 hours ago',
    status: 'PENDING',
  },
];

export default function StudentDoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>(mockDoubts);
  const [filter, setFilter] = useState<'ALL' | 'ANSWERED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [askModalOpen, setAskModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newChapter, setNewChapter] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = doubts.filter(d => {
    const matchesFilter = filter === 'ALL' || d.status === filter;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.chapter.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newDoubtItem: Doubt = {
      id: `d-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      chapter: newChapter || 'General Query',
      description: newDesc,
      createdAt: 'Just now',
      status: 'PENDING',
    };

    setDoubts([newDoubtItem, ...doubts]);
    setAskModalOpen(false);
    setNewTitle('');
    setNewChapter('');
    setNewDesc('');

    toast({
      title: 'Doubt Submitted! 🎯',
      description: 'Your question has been assigned to subject faculty. Expect an answer within 2 hours.',
    });
  };

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              1-on-1 Doubt Clearing Center
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Ask unlimited questions directly to your dedicated subject teachers
            </p>
          </div>

          <Button
            onClick={() => setAskModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ask a New Doubt
          </Button>
        </div>

        {/* Modal: Ask New Doubt */}
        {askModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Ask Subject Mentor
                  </h3>
                </div>
                <button
                  onClick={() => setAskModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDoubt} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Subject *</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Biology</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Chapter / Topic</label>
                    <Input
                      placeholder="e.g. Chapter 4: Carbon & Compounds"
                      className="text-xs h-10"
                      value={newChapter}
                      onChange={e => setNewChapter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Question Summary *</label>
                  <Input
                    required
                    placeholder="Briefly state your question or confusion..."
                    className="text-xs h-10"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full details, equation or steps where you got stuck..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAskModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit to Faculty
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div className="flex gap-2">
            {(['ALL', 'ANSWERED', 'PENDING'] as const).map(tab => (
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

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <Input
              placeholder="Search doubts or topics..."
              className="pl-9 text-xs sm:text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Doubts List */}
        <div className="space-y-6">
          {filtered.map(d => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {d.subject}
                  </span>
                  <span className="text-xs text-slate-400">• {d.chapter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    d.status === 'ANSWERED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {d.status === 'ANSWERED' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Answered
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-600" /> In Review
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">{d.createdAt}</span>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {d.title}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {d.description}
                </p>
              </div>

              {/* Answer if answered */}
              {d.answer ? (
                <div className="bg-brand-50/50 border border-brand-200/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      Faculty Solution from {d.answeredBy}
                    </p>
                    <span className="text-[11px] text-slate-400">{d.answeredAt}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pt-1">
                    {d.answer}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Assigned to faculty. You will receive an email and app notification when answered.</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
}
