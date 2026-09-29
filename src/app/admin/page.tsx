import { redirect } from 'next/navigation';
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
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.name}</p>
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
