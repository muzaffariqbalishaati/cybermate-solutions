'use client';

import { useState } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CalendarDays, CheckCircle2, Circle, Plus, Flame,
  Clock, Target, BookOpen, Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  subject: string;
  duration: string;
  date: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 't1', title: 'Complete Physics Chapter 2 ray diagram practice questions', subject: 'Physics', duration: '45 mins', date: 'Today', completed: true },
  { id: 't2', title: 'Revise 15 chemical decomposition formulas for Monday quiz', subject: 'Chemistry', duration: '30 mins', date: 'Today', completed: true },
  { id: 't3', title: 'Solve 10 board exam word problems on Quadratic Equations', subject: 'Mathematics', duration: '60 mins', date: 'Today', completed: false },
  { id: 't4', title: 'Watch recorded lecture on Refraction through Glass Prism', subject: 'Physics', duration: '50 mins', date: 'Tomorrow', completed: false },
  { id: 't5', title: 'Attend Live Doubt Clearing Session with Dr. Rajesh Verma', subject: 'Live Class', duration: '90 mins', date: 'Wednesday', completed: false },
];

export default function StudentPlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newDuration, setNewDuration] = useState('45 mins');

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      duration: newDuration,
      date: 'Today',
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    toast({
      title: 'Study Goal Added! 🎯',
      description: 'Keep the momentum going!',
    });
  };

  const completedToday = tasks.filter(t => t.date === 'Today' && t.completed).length;
  const totalToday = tasks.filter(t => t.date === 'Today').length;

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Study Planner & Daily Schedule
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Structure your daily revision goals and track your study streak
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 fill-white animate-bounce" />
            <span>7-Day Study Streak Active!</span>
          </div>
        </div>

        {/* Quick Stats & Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Progress</p>
            <p className="text-3xl font-heading font-black text-slate-900">
              {completedToday} of {totalToday} Tasks
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${totalToday ? (completedToday / totalToday) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Target Hours</p>
            <p className="text-3xl font-heading font-black text-brand-600">
              18.5 / 24 hrs
            </p>
            <p className="text-xs text-slate-500">77% of recommended revision completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Milestone</p>
            <p className="text-base font-bold text-slate-900 mt-1">
              Class 10 Mid-Term Mock Series
            </p>
            <p className="text-xs text-amber-600 font-medium">Starts in 5 days (Saturday)</p>
          </div>
        </div>

        {/* Task Creator Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-600" />
            Add a New Study Target
          </h2>

          <form onSubmit={addTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                required
                placeholder="What topic or exercise will you master today?"
                className="text-xs sm:text-sm h-11"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>

            <div>
              <select
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Live Class</option>
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm">
                Add Goal
              </Button>
            </div>
          </form>
        </div>

        {/* Tasks Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600" />
            Today's Revision Checklist
          </h2>

          <div className="divide-y divide-slate-100">
            {tasks.map(t => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-slate-50 px-3 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  {t.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 group-hover:text-brand-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-brand-600">{t.subject}</span>
                      <span>•</span>
                      <span>{t.duration}</span>
                      <span>•</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  t.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
