import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { StudentLayout } from '@/components/layouts/student-layout';
import Link from 'next/link';
import { BookOpen, PlayCircle, CalendarDays, FileText, Bell, TrendingUp, Clock, Award, BookMarked, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, getDaysRemaining } from '@/lib/utils';

async function getStudentDashboardData(userId: string) {
  try {
    const [enrollments, upcomingClasses, notifications, studyPlans, testAttempts, userRecord, latestNotes] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId, isActive: true },
        include: {
          course: {
            select: {
              id: true, title: true, slug: true, thumbnail: true,
              subject: true, grade: true, totalLessons: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 6,
      }),
      prisma.liveClass.findMany({
        where: {
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED',
          course: { enrollments: { some: { userId, isActive: true } } },
        },
        include: { course: { select: { title: true } } },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.studyPlan.findMany({
        where: { userId, date: { gte: new Date() }, status: { not: 'COMPLETED' } },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      prisma.testAttempt.findMany({
        where: { userId, submittedAt: { not: null } },
        include: { test: { select: { title: true, totalMarks: true } } },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      }),
      prisma.studyNote.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          subject: true,
          chapter: true,
          fileUrl: true,
          downloads: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
    ]);

    return {
      enrollments,
      upcomingClasses,
      notifications,
      studyPlans,
      testAttempts,
      avatar: userRecord?.avatar || null,
      latestNotes: latestNotes || [],
    };
  } catch {
    return {
      enrollments: [],
      upcomingClasses: [],
      notifications: [],
      studyPlans: [],
      testAttempts: [],
      avatar: null,
      latestNotes: [],
    };
  }
}

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || !['STUDENT'].includes(session.role)) {
    if (session?.role === 'ADMIN') redirect('/admin');
    if (session?.role === 'TEACHER') redirect('/teacher');
    if (session?.role === 'PARENT') redirect('/parent');
    redirect('/login');
  }

  const data = await getStudentDashboardData(session.userId);
  const unreadCount = data.notifications.length;

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-purple-500/10 p-5 sm:p-6 rounded-3xl border border-brand-500/20">
          <div className="flex items-center gap-3.5">
            <Link href="/student/profile" className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                {data.avatar ? (
                  <img src={data.avatar} alt={session.name} className="w-full h-full object-cover" />
                ) : (
                  session.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                Hello, {session.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {data.enrollments.length} active courses • Keep up your learning streak!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/profile"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-border shadow-sm text-foreground hover:bg-secondary transition-colors app-tap"
            >
              My Profile 👤
            </Link>
            {unreadCount > 0 && (
              <Link href="/student/notifications">
                <div className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold hover:bg-brand-100 transition-colors app-tap">
                  <Bell className="h-3.5 w-3.5" />
                  {unreadCount}
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:hidden">
          <Link
            href="/student/courses"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>📚</span> Courses
          </Link>
          <Link
            href="/student/live-classes"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Sessions
          </Link>
          <Link
            href="/student/doubts"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>❓</span> Ask Doubt
          </Link>
          <Link
            href="/student/tests"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>📝</span> Mock Tests
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Enrolled Courses', value: data.enrollments.length, icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
            { label: 'Upcoming Classes', value: data.upcomingClasses.length, icon: CalendarDays, color: 'text-purple-500 bg-purple-50' },
            { label: 'Pending Plans', value: data.studyPlans.length, icon: FileText, color: 'text-amber-500 bg-amber-50' },
            { label: 'Tests Taken', value: data.testAttempts.length, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <div className={`inline-flex h-10 w-10 rounded-xl items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-heading font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">My Courses</h2>
            <Link href="/student/courses" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          {data.enrollments.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground text-sm mb-6">Browse our courses and start learning today</p>
              <Button asChild variant="gradient">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.enrollments.map(enrollment => {
                const daysLeft = enrollment.expiresAt
                  ? getDaysRemaining(enrollment.expiresAt)
                  : null;
                return (
                  <Link key={enrollment.id} href={`/student/courses/${enrollment.course.slug}`}>
                    <div className="card-hover p-4 flex gap-3">
                      <div className="h-14 w-14 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-7 w-7 text-brand-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{enrollment.course.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{enrollment.course.subject}</span>
                          {enrollment.course.grade && <span>• Class {enrollment.course.grade}</span>}
                        </div>
                        <div className="mt-2 progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{enrollment.progress}% complete</span>
                          {daysLeft !== null && (
                            <span className={daysLeft < 7 ? 'text-red-500 font-medium' : ''}>
                              {daysLeft}d left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        {data.upcomingClasses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold">Upcoming Live Classes</h2>
              <Link href="/student/live-classes" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {data.upcomingClasses.map(cls => (
                <div key={cls.id} className="card p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{cls.title}</h3>
                    <p className="text-xs text-muted-foreground">{cls.course.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(cls.scheduledAt)} • {new Date(cls.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {cls.meetingUrl && (
                    <Button size="sm" variant="gradient" asChild>
                      <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer">Join</a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Planner */}
        {data.studyPlans.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold">Study Planner</h2>
              <Link href="/student/planner" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {data.studyPlans.map(plan => (
                <div key={plan.id} className="card p-3 flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${plan.priority === 'HIGH' ? 'bg-red-500' : plan.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{plan.task}</span>
                    <span className="text-xs text-muted-foreground ml-2">{plan.subject}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(plan.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Notes & Revision Material */}
        {data.latestNotes && data.latestNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-heading font-semibold">Latest Study Notes & PDFs</h2>
              </div>
              <Link href="/student/notes" className="text-sm font-semibold text-primary hover:underline">
                View all notes &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.latestNotes.map((note: any) => (
                <Link
                  key={note.id}
                  href="/student/notes"
                  className="card p-4 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                        {note.subject}
                      </span>
                      {note.chapter && (
                        <span className="text-[11px] text-muted-foreground truncate">{note.chapter}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm truncate group-hover:text-brand-600 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Download className="w-3 h-3" /> {note.downloads} student downloads
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <BookMarked className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
