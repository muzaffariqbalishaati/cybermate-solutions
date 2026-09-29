'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import {
  BarChart3, TrendingUp, Users, DollarSign,
  BookOpen, Award, ArrowUpRight, ShoppingCart, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TopCourse {
  title: string;
  enrollments: number;
  revenue: number;
  completionRate: string;
}

interface MonthlySale {
  month: string;
  amount: number;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    paidStudents: 0,
    completionRate: '84.2%',
    aov: 0,
  });
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setKpis(data.data.kpis);
        setMonthlySales(data.data.monthlySales);
        setTopCourses(data.data.topCourses);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load analytics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const maxSale = Math.max(...(monthlySales.map(m => m.amount)), 1000);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Platform Analytics & Business Intelligence
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Visual insights on revenue growth, enrollment trends, and student completion
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={fetchAnalytics} title="Refresh Analytics">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
        </div>

        {/* High Level KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {formatCurrency(kpis.totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Total Captured Sales
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {kpis.paidStudents}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Paid Students</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-purple-600">
              {kpis.completionRate}
            </p>
            <p className="text-xs text-slate-500 font-medium">Avg Completion Rate</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {formatCurrency(kpis.aov)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Average Order Value</p>
          </div>
        </div>

        {/* Visual Revenue Growth Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                Monthly Revenue Growth
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">INR (₹) Net Captured Revenue</p>
            </div>
          </div>

          {/* Bar visualization */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
            {monthlySales.length === 0 ? (
              <div className="w-full text-center text-slate-400 py-12">
                No orders processed yet this period.
              </div>
            ) : (
              monthlySales.map((m, idx) => {
                const heightPct = Math.max(Math.round((m.amount / maxSale) * 100), 8);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shadow-sm">
                      {formatCurrency(m.amount)}
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] rounded-xl bg-gradient-to-t from-brand-600 to-indigo-500 transition-all duration-500 group-hover:from-brand-500 group-hover:to-indigo-400 shadow-md shadow-brand-500/15"
                    />
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      {m.month}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Courses Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Top Performing Courses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by verified enrollments and revenue</p>
            </div>
          </div>

          <div className="space-y-3">
            {topCourses.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No published courses found.</p>
            ) : (
              topCourses.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                      <p className="text-xs text-slate-500">{c.enrollments} Enrolled Students</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:justify-end text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Gross Revenue</span>
                      <strong className="text-slate-900 text-sm font-bold">{formatCurrency(c.revenue)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Completion</span>
                      <strong className="text-emerald-600 text-sm font-bold">{c.completionRate}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
