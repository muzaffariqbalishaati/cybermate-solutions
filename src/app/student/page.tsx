import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { StudentLayout } from '@/components/layouts/student-layout';
import Link from 'next/link';
import { BookOpen, PlayCircle, CalendarDays, FileText, Bell, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, getDaysRemaining } from '@/lib/utils';

async function getStudentDashboardData(userId: string) {
  try {
    const [enrollments, upcomingClasses, notifications, studyPlans, testAttempts] = await Promise.all([
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
    ]);

    return { enrollments, upcomingClasses, notifications, studyPlans, testAttempts };
  } catch {
    return { enrollments: [], upcomingClasses: [], notifications: [], studyPlans: [], testAttempts: [] };
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
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Welcome back, {session.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              You have {data.enrollments.length} active courses
            </p>
          </div>
          {unreadCount > 0 && (
            <Link href="/student/notifications">
              <div className="flex items-center gap-2 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-brand-100 transition-colors">
                <Bell className="h-4 w-4" />
                {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
              </div>
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      </div>
    </StudentLayout>
  );
}
