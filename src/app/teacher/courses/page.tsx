'use client';

import { useState } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Users, PlayCircle, Plus, FileText, UploadCloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockTeacherCourses = [
  {
    id: 'tc-1',
    title: 'Class 10 Board Excellence - Mathematics & Science',
    grade: 'Class 10',
    subject: 'Physics & Science',
    enrolledCount: 840,
    totalLessons: 84,
    completedLessons: 62,
    progressPercent: 74,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tc-2',
    title: 'Complete Chemistry Foundations for JEE / NEET',
    grade: 'Class 11',
    subject: 'Chemistry',
    enrolledCount: 408,
    totalLessons: 62,
    completedLessons: 30,
    progressPercent: 48,
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80',
  },
];

export default function TeacherCoursesPage() {
  const [uploadModal, setUploadModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [moduleName, setModuleName] = useState('Module 1: Chemical Reactions');

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;
    setUploadModal(false);
    setLessonTitle('');
    toast({
      title: 'Lesson Added! 📚',
      description: 'The new lecture material has been published to student players.',
    });
  };

  return (
    <TeacherLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Assigned Courses & Curriculum
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage modules, lecture materials, and study resources for your batches
            </p>
          </div>

          <Button
            onClick={() => setUploadModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Upload New Lesson Material
          </Button>
        </div>

        {/* Modal: Add Lesson Material */}
        {uploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">Upload New Lesson</h3>
                <button onClick={() => setUploadModal(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddLesson} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course & Module</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                    value={moduleName}
                    onChange={e => setModuleName(e.target.value)}
                  >
                    <option>Module 1: Chemical Reactions & Equations</option>
                    <option>Module 2: Light - Reflection and Refraction</option>
                    <option>Module 3: Quadratic Equations & AP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lesson Title *</label>
                  <Input
                    required
                    placeholder="e.g. 2.5 Refraction through Glass Prism"
                    className="text-xs h-10"
                    value={lessonTitle}
                    onChange={e => setLessonTitle(e.target.value)}
                  />
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-brand-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Drag & drop lecture video or PDF notes</p>
                  <p className="text-[10px] text-slate-400">MP4, PDF, PPTX up to 500MB</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setUploadModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Publish Lesson
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockTeacherCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {course.grade}
                  </span>
                  <span className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {course.enrolledCount} Students
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-600">{course.subject}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{course.title}</h3>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Curriculum Delivered: {course.completedLessons}/{course.totalLessons} Lessons</span>
                      <span className="font-bold text-slate-900">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${course.progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button
                  onClick={() => setUploadModal(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-5"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Lecture / Resource
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </TeacherLayout>
  );
}
