'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, CheckCircle2, XCircle, Calendar, Percent } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  maxUses: number;
  timesUsed: number;
  expiresAt: string;
  isActive: boolean;
}

const initialCoupons: Coupon[] = [
  { id: 'cp-1', code: 'EDUPRO50', type: 'PERCENTAGE', value: 50, maxUses: 500, timesUsed: 214, expiresAt: '31 Dec 2026', isActive: true },
  { id: 'cp-2', code: 'FIRST50', type: 'PERCENTAGE', value: 50, maxUses: 1000, timesUsed: 842, expiresAt: '31 Dec 2026', isActive: true },
  { id: 'cp-3', code: 'SAVE500', type: 'FIXED', value: 500, maxUses: 200, timesUsed: 65, expiresAt: '15 Nov 2026', isActive: true },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState(20);
  const [maxUses, setMaxUses] = useState(100);

  const toggleStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast({ title: 'Coupon Status Updated' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      maxUses: Number(maxUses),
      timesUsed: 0,
      expiresAt: '31 Dec 2026',
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setModalOpen(false);
    setCode('');
    toast({
      title: 'Coupon Created! 🏷️',
      description: `Promo code ${newCoupon.code} is now live.`,
    });
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

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-5 px-5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Promo Coupon
          </Button>
        </div>

        {/* Modal: Create Coupon */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-bold text-lg text-slate-900">New Promo Code</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Coupon Code (Uppercase) *</label>
                  <Input
                    required
                    placeholder="e.g. FESTIVE30"
                    className="uppercase tracking-wider font-mono text-xs h-10"
                    value={code}
                    onChange={e => setCode(e.target.value)}
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
                      <option value="FIXED">Flat (₹)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Discount Value *</label>
                    <Input
                      type="number"
                      required
                      min={1}
                      className="text-xs h-10"
                      value={value}
                      onChange={e => setValue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Maximum Usages</label>
                  <Input
                    type="number"
                    min={1}
                    className="text-xs h-10"
                    value={maxUses}
                    onChange={e => setMaxUses(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                    Activate Coupon
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-6">Discount</th>
                  <th className="py-3.5 px-6">Redemptions</th>
                  <th className="py-3.5 px-6">Valid Until</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-600">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {coupon.timesUsed} / {coupon.maxUses} used
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">{coupon.expiresAt}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(coupon.id)}
                        className="text-xs"
                      >
                        {coupon.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
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
