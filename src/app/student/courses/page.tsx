'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen, PlayCircle, Search, Clock, Award,
  CheckCircle2, ArrowRight, BarChart3, Filter
} from 'lucide-react';

const mockEnrolledCourses = [
  {
    id: 'c1',
    title: 'Class 10 Board Excellence - Mathematics & Science',
    slug: 'class-10-board-excellence',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    instructor: 'Dr. Rajesh Verma',
    totalLessons: 84,
    completedLessons: 58,
    progressPercent: 69,
    nextLesson: '1.4 Quadratic Word Problems - Real Life Cases',
    grade: 'Class 10',
    category: 'Board Exams',
    lastAccessed: 'Yesterday',
  },
  {
    id: 'c2',
    title: 'Complete Chemistry Foundations for JEE / NEET',
    slug: 'complete-chemistry-foundations',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80',
    instructor: 'Meenakshi Iyer',
    totalLessons: 62,
    completedLessons: 24,
    progressPercent: 38,
    nextLesson: '3.2 Chemical Bonding & Hybridization Rules',
    grade: 'Class 11',
    category: 'Competitive',
    lastAccessed: '3 days ago',
  },
  {
    id: 'c3',
    title: 'Advanced Mechanics & Calculus - Physics Mastery',
    slug: 'advanced-mechanics-calculus',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    instructor: 'Prof. Vikram Malhotra',
    totalLessons: 50,
    completedLessons: 50,
    progressPercent: 100,
    nextLesson: 'Course Completed! View Certificate',
    grade: 'Class 12',
    category: 'JEE Advanced',
    lastAccessed: 'Last week',
  },
];

export default function StudentCoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredCourses = mockEnrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'in-progress') return matchesSearch && course.progressPercent < 100;
    if (activeTab === 'completed') return matchesSearch && course.progressPercent === 100;
    return matchesSearch;
  });

  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              My Learning
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              You are currently enrolled in {mockEnrolledCourses.length} active courses
            </p>
          </div>

          <Link href="/courses">
            <Button variant="outline" className="text-sm font-semibold">
              Browse More Courses
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div className="flex gap-2 w-full sm:w-auto">
            {(['all', 'in-progress', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <Input
              placeholder="Search your courses..."
              className="pl-9 text-xs sm:text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {course.grade}
                  </span>
                  {course.progressPercent === 100 && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-brand-600 font-semibold mb-1">
                      Instructor: {course.instructor}
                    </p>
                    <h3 className="font-heading font-bold text-slate-900 text-base line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                      <span className="font-bold text-slate-900">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.progressPercent === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                        }`}
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Up lesson pill */}
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                      Next up:
                    </p>
                    <p className="font-medium text-slate-800 truncate">
                      {course.nextLesson}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                <Link href={`/student/courses/${course.slug}`} className="w-full block">
                  <Button
                    className={`w-full font-bold text-xs py-5 ${
                      course.progressPercent === 100
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    {course.progressPercent === 100 ? (
                      <>
                        <Award className="w-4 h-4 mr-1.5" />
                        Review / Get Certificate
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
}
