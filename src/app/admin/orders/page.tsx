'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart, Search, Download, CheckCircle2,
  DollarSign, TrendingUp, Calendar, CreditCard,
  RefreshCw, FileText, AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  finalPrice: number;
}

interface Order {
  id: string;
  invoiceNumber: string;
  total: number;
  subtotal: number;
  discount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string | null;
  };
  items: OrderItem[];
  payment?: {
    status: string;
    gatewayPaymentId: string | null;
    gateway: string;
  } | null;
  invoice?: {
    id: string;
    invoiceNumber: string;
  } | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(
    o =>
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some(i => i.title.toLowerCase().includes(search.toLowerCase()))
  );

  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.total, 0);
  const aov = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

  const exportCSV = () => {
    if (orders.length === 0) {
      toast({ title: 'No orders to export' });
      return;
    }
    const headers = ['Invoice Number', 'Student Name', 'Student Email', 'Items', 'Total (INR)', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.invoiceNumber,
      `"${o.user?.name || 'Student'}"`,
      o.user?.email || '',
      `"${o.items?.map(i => i.title).join('; ') || 'Course'}"`,
      o.total,
      o.status,
      formatDate(o.createdAt),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CyberMate_Orders_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Complete', description: 'CSV file downloaded.' });
  };

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
              Live payment logs, gateway verification, and enrollment records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchOrders} title="Refresh Ledger">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={exportCSV}
              className="text-xs font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export to CSV
            </Button>
          </div>
        </div>

        {/* Revenue KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Sales</p>
            <p className="text-3xl font-heading font-black text-slate-900">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Verified captured revenue
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Orders</p>
            <p className="text-3xl font-heading font-black text-brand-600">
              {completedOrders.length}
            </p>
            <p className="text-xs text-slate-500">Out of {orders.length} total checkouts</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Order Value (AOV)</p>
            <p className="text-3xl font-heading font-black text-purple-600">
              {formatCurrency(aov)}
            </p>
            <p className="text-xs text-slate-500">Per paying student</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by invoice number, student name, email, or course..."
              className="pl-10 text-xs h-10 border-slate-200"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Student Details</th>
                  <th className="py-3.5 px-6">Purchased Items</th>
                  <th className="py-3.5 px-6">Amount Paid</th>
                  <th className="py-3.5 px-6">Payment Status</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No orders found. When students purchase courses, they will appear here in real time.
                    </td>
                  </tr>
                ) : (
                  filtered.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {o.invoiceNumber}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{o.user?.name || 'Student'}</p>
                        <p className="text-[11px] text-slate-500">{o.user?.email || '—'}</p>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate">
                          {o.items?.map(i => i.title).join(', ') || 'Course Access'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {o.items?.length || 1} {o.items?.length === 1 ? 'item' : 'items'}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(o.total)}
                        </span>
                        {o.discount > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-medium">
                            - {formatCurrency(o.discount)} discount
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            o.status === 'COMPLETED' ? 'bg-emerald-500' : o.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          {o.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(o.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
