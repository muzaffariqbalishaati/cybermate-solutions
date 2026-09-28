'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  PlayCircle, CheckCircle2, Circle, FileText, Download,
  MessageSquare, ChevronLeft, ChevronRight, Menu, X,
  Bookmark, Share2, HelpCircle, Send, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz';
  videoUrl?: string;
  completed?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

const courseCurriculum: Chapter[] = [
  {
    id: 'ch1',
    title: 'Module 1: Chemical Reactions & Equations',
    lessons: [
      { id: 'l1', title: '1.1 Introduction to Chemical Changes & Word Equations', duration: '28 min', type: 'video', completed: true },
      { id: 'l2', title: '1.2 Balancing Chemical Equations Made Easy', duration: '35 min', type: 'video', completed: true },
      { id: 'l3', title: '1.3 Types of Reactions: Combination & Decomposition', duration: '42 min', type: 'video', completed: false },
      { id: 'l4', title: '1.4 Oxidation, Reduction & Corrosion in Daily Life', duration: '38 min', type: 'video', completed: false },
      { id: 'l5', title: '1.5 Chapter Test & Practice Worksheet', duration: '45 min', type: 'quiz', completed: false },
    ],
  },
  {
    id: 'ch2',
    title: 'Module 2: Light - Reflection and Refraction',
    lessons: [
      { id: 'l6', title: '2.1 Laws of Reflection and Spherical Mirrors', duration: '40 min', type: 'video', completed: false },
      { id: 'l7', title: '2.2 Ray Diagrams for Concave & Convex Mirrors', duration: '50 min', type: 'video', completed: false },
      { id: 'l8', title: '2.3 Mirror Formula & Sign Convention Shortcuts', duration: '45 min', type: 'video', completed: false },
      { id: 'l9', title: '2.4 Refraction through Glass Prism & Lens Formula', duration: '55 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'ch3',
    title: 'Module 3: Mathematics - Quadratic Equations & AP',
    lessons: [
      { id: 'l10', title: '3.1 Standard Form and Factorization Techniques', duration: '45 min', type: 'video', completed: false },
      { id: 'l11', title: '3.2 Quadratic Formula & Nature of Roots', duration: '40 min', type: 'video', completed: false },
      { id: 'l12', title: '3.3 Arithmetic Progression: nth Term & Sum Formula', duration: '48 min', type: 'video', completed: false },
    ],
  },
];

export default function StudentCoursePlayerPage() {
  const params = useParams();
  const [curriculum, setCurriculum] = useState<Chapter[]>(courseCurriculum);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(courseCurriculum[0].lessons[2]); // l3
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'doubts' | 'notes'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [personalNotes, setPersonalNotes] = useState('Key concept: Decomposition reactions require energy in the form of heat, light or electricity for breaking down the reactants.');
  const [doubtText, setDoubtText] = useState('');
  const [askedDoubts, setAskedDoubts] = useState([
    {
      id: 1,
      question: 'Why is respiration considered an exothermic reaction?',
      answer: 'During digestion, food is broken down into simpler substances like glucose. Glucose combines with oxygen in cells to release energy, hence it is exothermic.',
      teacher: 'Dr. Rajesh Verma',
      time: '2 hours ago',
    },
  ]);

  const toggleLessonComplete = (lessonId: string) => {
    setCurriculum(prev =>
      prev.map(chap => ({
        ...chap,
        lessons: chap.lessons.map(l =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        ),
      }))
    );

    const isNowComplete = !currentLesson.completed;
    if (currentLesson.id === lessonId) {
      setCurrentLesson(prev => ({ ...prev, completed: isNowComplete }));
    }

    if (isNowComplete) {
      toast({
        title: 'Lesson Completed! 🌟',
        description: 'Great progress! Your completion percentage has updated.',
      });
    }
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    setAskedDoubts(prev => [
      {
        id: Date.now(),
        question: doubtText,
        answer: 'Thank you for your question. Teacher Dr. Rajesh Verma has received your doubt and will respond shortly.',
        teacher: 'Teaching Assistant',
        time: 'Just now',
      },
      ...prev,
    ]);

    setDoubtText('');
    toast({
      title: 'Doubt Submitted! 📝',
      description: 'Your mentor has been notified and will reply shortly.',
    });
  };

  // Calculate overall progress
  const allLessons = curriculum.flatMap(c => c.lessons);
  const completedCount = allLessons.filter(l => l.completed).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Player Navigation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/student/courses"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <h1 className="text-xs sm:text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
            {currentLesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Course Progress:</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="w-4 h-4 mr-1" /> : <Menu className="w-4 h-4 mr-1" />}
            Curriculum
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Video Player & Tabs */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Simulated Video Player */}
          <div className="bg-black aspect-video max-h-[65vh] w-full relative flex items-center justify-center border-b border-slate-800">
            <div className="text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-brand-600/90 text-white flex items-center justify-center mx-auto shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                <PlayCircle className="w-12 h-12 fill-white/20" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Playing: {currentLesson.title}
              </p>
              <p className="text-xs text-slate-400">
                Duration: {currentLesson.duration} • 1080p Full HD Available
              </p>
            </div>

            {/* Video Player overlay controls bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLessonComplete(currentLesson.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    currentLesson.completed
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {currentLesson.completed ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Speed: 1.0x</span>
                <span className="text-[11px] text-slate-400">HD 1080p</span>
              </div>
            </div>
          </div>

          {/* Lesson Tabs Navigation */}
          <div className="border-b border-slate-800 bg-slate-900 px-6 flex gap-6 text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'resources', label: 'Resources & Downloads' },
              { id: 'doubts', label: 'Ask a Doubt / Q&A' },
              { id: 'notes', label: 'My Notes' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="p-6 max-w-4xl space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">About this Lecture</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  In this session, Dr. Rajesh Verma breaks down Chemical Combination and Decomposition reactions. We explore thermal decomposition, electrolysis of water, and photochemical decomposition with practical laboratory demonstrations and high-frequency board examination numericals.
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Key Exam Formulae & Equations:
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1 font-mono">
                    <li>• 2Pb(NO3)2 (s) --[Heat]&rarr; 2PbO (s) + 4NO2 (g) + O2 (g) [Brown Fumes]</li>
                    <li>• 2AgCl (s) --[Sunlight]&rarr; 2Ag (s) + Cl2 (g) [Used in B&W Photography]</li>
                    <li>• CaCO3 (s) --[Heat]&rarr; CaO (s) + CO2 (g) [Quicklime manufacture]</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Downloadable Materials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Lecture Notes & Annotations (Handwritten PDF)', size: '3.4 MB' },
                    { title: 'Chapter 1 NCERT Exemplar Solutions', size: '1.8 MB' },
                    { title: 'Previous 10 Years Board Questions with Marking Scheme', size: '4.2 MB' },
                    { title: 'Practice Worksheet - Types of Chemical Reactions', size: '1.1 MB' },
                  ].map((res, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-brand-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{res.title}</p>
                          <p className="text-[10px] text-slate-500">{res.size}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast({ title: 'Download Started', description: `Downloading ${res.title}` })}
                        className="text-xs text-brand-400 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'doubts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Ask Your Doubt</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your question will be directly answered by Dr. Rajesh Verma or his teaching assistants.
                  </p>
                </div>

                <form onSubmit={handlePostDoubt} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Describe your question or difficulty in this lecture..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    value={doubtText}
                    onChange={e => setDoubtText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold">
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Submit Doubt
                    </Button>
                  </div>
                </form>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-300">Previous Q&A in this lesson</h3>
                  {askedDoubts.map(d => (
                    <div key={d.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-white">Q: {d.question}</span>
                        <span>{d.time}</span>
                      </div>
                      <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-lg border-l-2 border-brand-500">
                        <p className="font-semibold text-brand-400 text-[11px] mb-1">Answered by {d.teacher}:</p>
                        <p className="leading-relaxed">{d.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Personal Study Scratchpad</h2>
                  <span className="text-xs text-emerald-400">Autosaved</span>
                </div>
                <textarea
                  rows={8}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500"
                  value={personalNotes}
                  onChange={e => setPersonalNotes(e.target.value)}
                  placeholder="Jot down formulas, revision points, or timestamps..."
                />
              </div>
            )}

          </div>
        </div>

        {/* Right: Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Course Syllabus</h3>
                <p className="text-[11px] text-slate-400">{allLessons.length} Total Lessons</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-2">
              {curriculum.map((chap, cIdx) => (
                <div key={chap.id} className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/40 rounded-lg">
                    {chap.title}
                  </div>
                  <div className="space-y-0.5">
                    {chap.lessons.map(lesson => {
                      const isActive = lesson.id === currentLesson.id;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white font-medium shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lesson.id);
                              }}
                              className="text-slate-400 hover:text-emerald-400 flex-shrink-0"
                            >
                              {lesson.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className={`text-[10px] flex-shrink-0 ${isActive ? 'text-brand-200' : 'text-slate-500'}`}>
                            {lesson.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
