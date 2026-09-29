'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, CheckCircle2, XCircle, Calendar, Percent, RefreshCw, Trash2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState(20);
  const [usageLimit, setUsageLimit] = useState(100);
  const [minOrder, setMinOrder] = useState<number | ''>(500);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load coupons', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      const nextStatus = !coupon.isActive;
      const res = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, isActive: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev =>
          prev.map(c => c.id === coupon.id ? { ...c, isActive: nextStatus } : c)
        );
        toast({ title: `Coupon ${nextStatus ? 'Activated' : 'Deactivated'}` });
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string, codeStr: string) => {
    if (!confirm(`Delete coupon "${codeStr}"?`)) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        toast({ title: 'Coupon Deleted', description: `Promo code ${codeStr} removed.` });
      } else {
        throw new Error(data.error || 'Failed to delete coupon');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({ title: 'Code Required', description: 'Please enter a coupon code', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: Number(value),
          usageLimit: usageLimit ? Number(usageLimit) : null,
          minOrder: minOrder !== '' ? Number(minOrder) : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Coupon Created! 🏷️',
          description: `Promo code ${code.toUpperCase()} is now live in database.`,
        });
        setModalOpen(false);
        setCode('');
        fetchCoupons();
      } else {
        throw new Error(data.error || 'Failed to create coupon');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Discount Coupons & Promotions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Create and manage promotional discount voucher codes for course checkouts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchCoupons} title="Refresh Coupons">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Promo Coupon
            </Button>
          </div>
        </div>

        {/* Modal: Create Coupon */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">New Promo Code</h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Promo Code *</label>
                  <Input
                    required
                    placeholder="e.g. CYBERMATE20 or FESTIVE50"
                    className="font-mono uppercase text-xs h-10"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Discount Type</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Discount Value</label>
                    <Input
                      type="number"
                      min="1"
                      required
                      className="text-xs h-10"
                      value={value}
                      onChange={e => setValue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Max Usage Limit</label>
                    <Input
                      type="number"
                      min="1"
                      className="text-xs h-10"
                      value={usageLimit}
                      onChange={e => setUsageLimit(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Min Cart Order (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      className="text-xs h-10"
                      value={minOrder}
                      onChange={e => setMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs">
                    Activate Promo Code
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm h-40 animate-pulse" />
            ))
          ) : coupons.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border">
              No promo coupons found. Click "Create Promo Coupon" to add discount codes for your students.
            </div>
          ) : (
            coupons.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="font-mono font-black text-lg text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-xl tracking-wider">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleStatus(c)}
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full transition-colors ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="space-y-2 pt-3">
                    <p className="text-2xl font-black text-slate-900">
                      {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                    </p>
                    <p className="text-xs text-slate-500">
                      Used <strong className="text-slate-800">{c.usedCount}</strong> of {c.usageLimit || '∞'} times
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs text-slate-500">
                  <span>Created {formatDate(c.createdAt)}</span>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
