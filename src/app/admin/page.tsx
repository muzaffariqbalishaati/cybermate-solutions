import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminStats } from '@/components/admin/admin-stats';
import { RecentOrders } from '@/components/admin/recent-orders';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { AdminLayout } from '@/components/layouts/admin-layout';

async function getAdminDashboardData() {
  try {
    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      todaySales,
      monthlyRevenue,
      pendingDoubts,
      pendingAssignments,
      upcomingClasses,
      recentOrders,
      monthlyRevenueData,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count({ where: { isActive: true } }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { total: true },
      }),
      prisma.doubt.count({ where: { status: 'PENDING' } }),
      prisma.assignment.count({ where: { isPublished: true } }),
      prisma.liveClass.count({
        where: {
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED',
        },
      }),
      prisma.order.findMany({
        where: { status: 'COMPLETED' },
        include: {
          user: { select: { name: true, email: true } },
          items: { take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // Monthly revenue for chart (last 6 months)
      prisma.$queryRaw`
        SELECT 
          TO_CHAR("createdAt", 'Mon YYYY') as month,
          COALESCE(SUM("total"), 0)::float as revenue,
          COUNT(*)::int as orders
        FROM "orders"
        WHERE "status"::text = 'COMPLETED'
          AND "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR("createdAt", 'Mon YYYY'), DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      ` as Promise<Array<{ month: string; revenue: number; orders: number }>>,
    ]);

    return {
      stats: {
        totalStudents,
        activeStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        todaySales: todaySales._sum.total || 0,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
        pendingDoubts,
        pendingAssignments,
        upcomingClasses,
      },
      recentOrders,
      monthlyRevenueData,
    };
  } catch {
    return {
      stats: {
        totalStudents: 0, activeStudents: 0, totalTeachers: 0, totalCourses: 0,
        totalEnrollments: 0, todaySales: 0, monthlyRevenue: 0, pendingDoubts: 0,
        pendingAssignments: 0, upcomingClasses: 0,
      },
      recentOrders: [],
      monthlyRevenueData: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const data = await getAdminDashboardData();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-gradient-to-r from-slate-900 to-brand-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md overflow-hidden flex-shrink-0">
              {session.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-full">
                Administration Console
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1">
                Welcome back, {session.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time platform insights, revenue ledger, and faculty governance
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
          <Link
            href="/admin/courses"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>📚</span> Courses
          </Link>
          <Link
            href="/admin/students"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>🎓</span> Students
          </Link>
          <Link
            href="/admin/teachers"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>👨‍🏫</span> Faculty
          </Link>
          <Link
            href="/admin/orders"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>💰</span> Orders
          </Link>
          <Link
            href="/admin/settings"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm app-tap"
          >
            <span>⚙️</span> Settings
          </Link>
        </div>

        <AdminStats stats={data.stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={data.monthlyRevenueData} />
          </div>
          <div>
            <RecentOrders orders={data.recentOrders} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
