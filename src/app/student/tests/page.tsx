'use client';

import { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import {
  ClipboardList, CheckCircle2, XCircle, Clock, AlertCircle,
  Award, ArrowRight, RotateCcw, HelpCircle, BarChart3, ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestItem {
  id: string;
  title: string;
  subject: string;
  course: string;
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  status: 'available' | 'completed';
  lastScore?: string;
  questions: Question[];
}

const mockTests: TestItem[] = [
  {
    id: 't-1',
    title: 'Chapter 1 Assessment: Chemical Reactions & Equations',
    subject: 'Science - Chemistry',
    course: 'Class 10 Board Excellence',
    durationMinutes: 20,
    totalMarks: 20,
    questionsCount: 5,
    status: 'available',
    questions: [
      {
        id: 1,
        question: 'Which of the following is a decomposition reaction that occurs in the presence of sunlight?',
        options: [
          '2H2 + O2 -> 2H2O',
          '2AgCl -> 2Ag + Cl2',
          'CaO + H2O -> Ca(OH)2',
          'Zn + H2SO4 -> ZnSO4 + H2'
        ],
        correctAnswer: 1,
        explanation: 'Silver chloride (AgCl) turns grey in sunlight due to the decomposition of silver chloride into silver and chlorine by light (photochemical decomposition).'
      },
      {
        id: 2,
        question: 'When aqueous solutions of potassium iodide and lead nitrate are mixed, an insoluble precipitate is formed. What is the color of this precipitate?',
        options: ['White', 'Yellow', 'Black', 'Blue'],
        correctAnswer: 1,
        explanation: 'Lead nitrate reacts with potassium iodide to form lead iodide (PbI2), which is a characteristic bright yellow precipitate.'
      },
      {
        id: 3,
        question: 'Respiration is an example of which kind of process?',
        options: ['Endothermic process', 'Exothermic process', 'Decomposition process only', 'Reduction only'],
        correctAnswer: 1,
        explanation: 'During cellular respiration, glucose is oxidized in the presence of oxygen releasing ATP energy, water, and carbon dioxide. Hence it is exothermic.'
      },
      {
        id: 4,
        question: 'Fatty foods become rancid over time primarily due to:',
        options: ['Corrosion', 'Oxidation', 'Reduction', 'Hydrogenation'],
        correctAnswer: 1,
        explanation: 'When fats and oils are oxidized, they become rancid and their smell and taste change.'
      },
      {
        id: 5,
        question: 'The reaction between zinc and dilute sulphuric acid produces which gas?',
        options: ['Oxygen', 'Carbon Dioxide', 'Hydrogen', 'Nitrogen Dioxide'],
        correctAnswer: 2,
        explanation: 'Metals above hydrogen in the reactivity series displace hydrogen from dilute acids, producing salt and H2 gas.'
      }
    ]
  },
  {
    id: 't-2',
    title: 'Optics & Spherical Mirrors Speed Quiz',
    subject: 'Science - Physics',
    course: 'Class 10 Board Excellence',
    durationMinutes: 15,
    totalMarks: 15,
    questionsCount: 5,
    status: 'completed',
    lastScore: '14/15 (93%)',
    questions: [
      {
        id: 1,
        question: 'What is the focal length of a plane mirror?',
        options: ['Zero', 'Infinity', '1 meter', 'Negative 1 meter'],
        correctAnswer: 1,
        explanation: 'A plane mirror can be considered a spherical mirror of infinite radius of curvature, so f = R/2 = infinity.'
      }
    ]
  }
];

export default function StudentTestsPage() {
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResult, setTestResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    review: boolean;
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || testResult) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTest, testResult]);

  const handleStartTest = (test: TestItem) => {
    setActiveTest(test);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeft(test.durationMinutes * 60);
    setTestResult(null);
  };

  const handleSelectOption = (qId: number, optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let score = 0;
    activeTest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 4; // 4 marks per question
      }
    });

    const total = activeTest.questions.length * 4;
    const percentage = Math.round((score / total) * 100);

    setTestResult({
      score,
      total,
      percentage,
      review: true,
    });

    toast({
      title: 'Test Submitted!',
      description: `You scored ${score}/${total} (${percentage}%)`,
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Tests & Quizzes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Timed assessments, chapter quizzes, and national mock series
            </p>
          </div>
        </div>

        {/* Real-time Test Engine Modal / Interface */}
        {activeTest && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8">
            
            {/* Test Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  {activeTest.subject}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {activeTest.title}
                </h2>
              </div>

              {!testResult && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-2xl font-mono text-base font-bold">
                  <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                  Time Remaining: {formatTimer(timeLeft)}
                </div>
              )}
            </div>

            {/* Test Taking Screen */}
            {!testResult ? (
              <div className="space-y-8">
                {/* Question index bubbles */}
                <div className="flex flex-wrap gap-2">
                  {activeTest.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-brand-600 text-white shadow-md'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Question Box */}
                {activeTest.questions[currentQIndex] && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Question {currentQIndex + 1} of {activeTest.questions.length} (4 Marks)
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                        {activeTest.questions[currentQIndex].question}
                      </h3>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3">
                      {activeTest.questions[currentQIndex].options.map((opt, optIdx) => {
                        const qId = activeTest.questions[currentQIndex].id;
                        const isSelected = selectedAnswers[qId] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(qId, optIdx)}
                            className={`p-4 rounded-xl border text-sm cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-brand-50 border-brand-500 text-brand-900 font-semibold shadow-sm'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                    className="text-xs font-semibold"
                  >
                    Previous Question
                  </Button>

                  <div className="flex gap-3">
                    {currentQIndex < activeTest.questions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQIndex(prev => prev + 1)}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                      >
                        Next Question
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitTest}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6"
                      >
                        Submit Test
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Score & Detailed Question Review */
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-200 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <Award className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                    Test Completed!
                  </h3>
                  <div className="flex justify-center gap-8 py-2">
                    <div>
                      <p className="text-3xl font-heading font-black text-brand-600">
                        {testResult.score}/{testResult.total}
                      </p>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Score</p>
                    </div>
                    <div className="h-10 w-px bg-slate-300 self-center" />
                    <div>
                      <p className="text-3xl font-heading font-black text-emerald-600">
                        {testResult.percentage}%
                      </p>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Accuracy</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveTest(null)}
                    variant="outline"
                    className="text-xs font-semibold"
                  >
                    Return to Tests Dashboard
                  </Button>
                </div>

                {/* Step by step review */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Question Analysis & Step-by-Step Solutions
                  </h3>

                  {activeTest.questions.map((q, idx) => {
                    const studentAns = selectedAnswers[q.id];
                    const isCorrect = studentAns === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-6 rounded-2xl border space-y-4 ${
                          isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                            {idx + 1}. {q.question}
                          </h4>
                          {isCorrect ? (
                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4" /> +4 Marks
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-700 bg-red-100 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                              <XCircle className="w-4 h-4" /> 0 Marks
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = studentAns === optIdx;
                            const isRight = optIdx === q.correctAnswer;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-lg flex items-center justify-between ${
                                  isRight
                                    ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                                    : isSelected
                                    ? 'bg-red-100/70 text-red-900'
                                    : 'text-slate-600'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isRight && <span className="text-[10px] text-emerald-700 uppercase font-bold">Correct Answer</span>}
                                {isSelected && !isRight && <span className="text-[10px] text-red-600 uppercase font-bold">Your Choice</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                          <p className="font-bold text-slate-900">Explanation:</p>
                          <p className="leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tests List Grid */}
        {!activeTest && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map(test => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full">
                      {test.subject}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {test.durationMinutes} Mins
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Course: {test.course} • {test.questionsCount} Questions • {test.totalMarks} Marks
                  </p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  {test.lastScore ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Last Score: {test.lastScore}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not Attempted</span>
                  )}

                  <Button
                    onClick={() => handleStartTest(test)}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    {test.lastScore ? 'Re-attempt Quiz' : 'Start Test'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
}
