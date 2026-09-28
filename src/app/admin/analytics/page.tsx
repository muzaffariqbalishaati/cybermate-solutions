'use client';

import { AdminLayout } from '@/components/layouts/admin-layout';
import {
  BarChart3, TrendingUp, Users, DollarSign,
  BookOpen, Award, ArrowUpRight, ShoppingCart
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const topCourses = [
    { title: 'Class 10 Board Excellence - Math & Science', enrollments: 840, revenue: 2478000, completionRate: '84%' },
    { title: 'Complete Chemistry Foundations for JEE / NEET', enrollments: 620, revenue: 1550000, completionRate: '76%' },
    { title: 'Advanced Mechanics & Calculus - Physics Mastery', enrollments: 480, revenue: 1440000, completionRate: '88%' },
    { title: 'Foundation Science & Math for Class 9', enrollments: 400, revenue: 996000, completionRate: '82%' },
  ];

  const monthlySales = [
    { month: 'Apr', amount: 320000 },
    { month: 'May', amount: 480000 },
    { month: 'Jun', amount: 620000 },
    { month: 'Jul', amount: 790000 },
    { month: 'Aug', amount: 950000 },
    { month: 'Sep', amount: 1240000 },
  ];

  const maxSale = Math.max(...monthlySales.map(m => m.amount));

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
        </div>

        {/* High Level KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {formatCurrency(6464000)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +28.5% YoY Growth
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">2,340</p>
            <p className="text-xs text-slate-500 font-medium">Total Paid Students</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-purple-600">82.4%</p>
            <p className="text-xs text-slate-500 font-medium">Course Completion Rate</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {formatCurrency(2760)}
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
                Monthly Revenue Growth (Last 6 Months)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">INR (₹) Net Captured Revenue</p>
            </div>
          </div>

          {/* Bar visualization */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
            {monthlySales.map(m => {
              const heightPercent = Math.round((m.amount / maxSale) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCurrency(m.amount)}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-48">
                    <div
                      className="w-full bg-brand-600 group-hover:bg-brand-700 rounded-t-xl transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Top Performing Courses by Revenue
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Course Name</th>
                  <th className="py-3.5 px-4">Enrollments</th>
                  <th className="py-3.5 px-4">Total Revenue</th>
                  <th className="py-3.5 px-4">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCourses.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{c.title}</td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{c.enrollments} Students</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{formatCurrency(c.revenue)}</td>
                    <td className="py-4 px-4 font-semibold text-purple-700">{c.completionRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
