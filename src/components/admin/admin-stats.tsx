import { TrendingUp, TrendingDown, Users, BookOpen, ShoppingCart, DollarSign, GraduationCap, MessageSquare, CalendarDays, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  todaySales: number;
  monthlyRevenue: number;
  pendingDoubts: number;
  pendingAssignments: number;
  upcomingClasses: number;
}

interface AdminStatsProps {
  stats: Stats;
}

export function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString('en-IN'),
      subtitle: `${stats.activeStudents} active`,
      icon: GraduationCap,
      gradient: 'from-blue-500 to-cyan-500',
      trend: '+12%',
      up: true,
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString('en-IN'),
      subtitle: 'Verified educators',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      trend: '+3%',
      up: true,
    },
    {
      title: 'Published Courses',
      value: stats.totalCourses.toLocaleString('en-IN'),
      subtitle: `${stats.totalEnrollments} enrollments`,
      icon: BookOpen,
      gradient: 'from-amber-500 to-orange-500',
      trend: '+8%',
      up: true,
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      subtitle: 'Revenue today',
      icon: ShoppingCart,
      gradient: 'from-emerald-500 to-teal-500',
      trend: '+23%',
      up: true,
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      subtitle: 'This month',
      icon: DollarSign,
      gradient: 'from-rose-500 to-red-500',
      trend: '-5%',
      up: false,
    },
    {
      title: 'Pending Doubts',
      value: stats.pendingDoubts.toString(),
      subtitle: 'Awaiting answers',
      icon: MessageSquare,
      gradient: 'from-indigo-500 to-violet-500',
      trend: '',
      up: null,
    },
    {
      title: 'Upcoming Classes',
      value: stats.upcomingClasses.toString(),
      subtitle: 'Scheduled live sessions',
      icon: CalendarDays,
      gradient: 'from-sky-500 to-blue-500',
      trend: '',
      up: null,
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments.toString(),
      subtitle: 'Need review',
      icon: AlertCircle,
      gradient: 'from-fuchsia-500 to-pink-500',
      trend: '',
      up: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map(card => (
        <div key={card.title} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            {card.trend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {card.trend}
              </div>
            )}
          </div>
          <div className="text-2xl font-heading font-bold mb-0.5">{card.value}</div>
          <div className="text-sm font-medium text-foreground">{card.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
