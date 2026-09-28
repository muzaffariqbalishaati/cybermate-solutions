'use client';

import { StudentLayout } from '@/components/layouts/student-layout';
import { ShoppingBag, Download, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const mockOrders = [
  {
    orderId: 'ORD-2026-904128',
    courseTitle: 'Class 10 Board Excellence - Mathematics & Science',
    date: '10 Feb 2026',
    amount: 2949,
    method: 'UPI (GPay)',
    status: 'COMPLETED',
    invoiceNo: 'INV-202602-491028',
  },
  {
    orderId: 'ORD-2025-781042',
    courseTitle: 'Complete Chemistry Foundations for JEE / NEET',
    date: '15 Dec 2025',
    amount: 3499,
    method: 'Credit Card',
    status: 'COMPLETED',
    invoiceNo: 'INV-202512-301928',
  },
  {
    orderId: 'ORD-2025-410928',
    courseTitle: 'Advanced Mechanics & Calculus - Physics Mastery',
    date: '02 Aug 2025',
    amount: 1999,
    method: 'UPI (PhonePe)',
    status: 'COMPLETED',
    invoiceNo: 'INV-202508-110293',
  },
];

export default function StudentOrdersPage() {
  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Billing & Order History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              View your course purchases, payment receipts, and tax invoices
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              Past Enrollments & Invoices
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Course</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Method</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockOrders.map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                      {order.courseTitle}
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{order.date}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">{order.method}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: 'Invoice Downloaded', description: `Downloaded tax receipt for ${order.invoiceNo}` })}
                        className="text-xs font-semibold"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        PDF Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
