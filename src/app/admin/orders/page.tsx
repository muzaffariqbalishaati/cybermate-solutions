'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart, Search, Download, CheckCircle2,
  DollarSign, TrendingUp, Calendar, CreditCard
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  paymentMethod: string;
  status: 'COMPLETED' | 'REFUNDED' | 'FAILED';
  date: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-2026-904128', studentName: 'Aarav Sharma', studentEmail: 'aarav@gmail.com', courseTitle: 'Class 10 Board Excellence', amount: 2949, paymentMethod: 'UPI (Razorpay)', status: 'COMPLETED', date: 'Today, 11:20 AM' },
  { id: 'ORD-2026-904127', studentName: 'Pooja Verma', studentEmail: 'pooja.v@gmail.com', courseTitle: 'Complete Chemistry Foundations', amount: 2499, paymentMethod: 'Card (Razorpay)', status: 'COMPLETED', date: 'Today, 09:45 AM' },
  { id: 'ORD-2026-904126', studentName: 'Rohan Mehra', studentEmail: 'rohan.m@gmail.com', courseTitle: 'Advanced Mechanics & Calculus', amount: 3999, paymentMethod: 'Netbanking', status: 'COMPLETED', date: 'Yesterday' },
  { id: 'ORD-2026-904125', studentName: 'Sneha Patel', studentEmail: 'sneha.p@gmail.com', courseTitle: 'Class 10 Board Excellence', amount: 2949, paymentMethod: 'UPI (PhonePe)', status: 'COMPLETED', date: 'Yesterday' },
  { id: 'ORD-2026-904124', studentName: 'Karan Singhania', studentEmail: 'karan.s@gmail.com', courseTitle: 'Complete Chemistry Foundations', amount: 2499, paymentMethod: 'UPI (GPay)', status: 'COMPLETED', date: '3 days ago' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');

  const filtered = orders.filter(
    o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Orders & Transaction Ledger
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time payment logs, revenue verification, and invoices
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => toast({ title: 'Exporting CSV', description: 'Transaction ledger generated.' })}
            className="text-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export to CSV
          </Button>
        </div>

        {/* Revenue KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales (Sample Ledger)</p>
            <p className="text-3xl font-heading font-black text-slate-900">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% compared to last week
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders Processed</p>
            <p className="text-3xl font-heading font-black text-brand-600">
              {orders.length}
            </p>
            <p className="text-xs text-slate-500">100% successful gateway capture</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Order Value (AOV)</p>
            <p className="text-3xl font-heading font-black text-purple-600">
              {formatCurrency(Math.round(totalRevenue / orders.length))}
            </p>
            <p className="text-xs text-slate-500">High bundle adoption</p>
          </div>
        </div>

        {/* Search & Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="Search order ID, student, or course..."
                className="pl-9 text-xs sm:text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{order.studentName}</p>
                      <p className="text-xs text-slate-400">{order.studentEmail}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      {order.courseTitle}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">{order.paymentMethod}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Captured
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">{order.date}</td>
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
