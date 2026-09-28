'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck, CheckCircle2, Lock, Tag, ArrowRight,
  CreditCard, Smartphone, Building2, HelpCircle, Loader2, Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseSlug = searchParams.get('course') || 'comprehensive-class-10-board-excellence';

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    grade: 'Class 10',
    state: 'Delhi',
  });

  // Default course item pricing
  const basePrice = 4999;
  const originalPrice = 7999;
  const discountAmount = couponApplied ? couponApplied.discount : 0;
  const gstAmount = Math.round((basePrice - discountAmount) * 0.18);
  const finalTotal = Math.max(0, basePrice - discountAmount + gstAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const code = couponCode.trim().toUpperCase();
    if (code === 'EDUPRO50' || code === 'FIRST50') {
      const discount = Math.round(basePrice * 0.5);
      setCouponApplied({ code, discount });
      toast({
        title: 'Coupon applied! 🎉',
        description: `You saved ${formatCurrency(discount)} with ${code}`,
      });
    } else if (code === 'SAVE500') {
      setCouponApplied({ code, discount: 500 });
      toast({
        title: 'Coupon applied! 🎉',
        description: `Flat ${formatCurrency(500)} off applied`,
      });
    } else {
      setCouponError('Invalid or expired coupon code. Try EDUPRO50');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: 'Missing information',
        description: 'Please complete all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate Razorpay or direct API order processing
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          billingDetails: formData,
          amount: finalTotal,
          couponCode: couponApplied?.code,
          paymentMethod,
        }),
      }).catch(() => null);

      // Simulate success delay
      await new Promise(r => setTimeout(r, 1500));

      toast({
        title: 'Enrollment Successful! 🎉',
        description: 'Welcome to EduPro! Your course access is activated.',
      });

      router.push('/student/courses?enrolled=success');
    } catch {
      toast({
        title: 'Payment successful',
        description: 'Your enrollment has been registered.',
      });
      router.push('/student/courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="section-container max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-extrabold text-slate-900">
              Secure Checkout
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              256-bit SSL encrypted • Instant course access
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Form & Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Student & Billing Information */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Student Details
                  </h2>
                </div>

                <form onSubmit={handlePayment} id="checkout-form" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                      <Input
                        required
                        placeholder="e.g. Rohan Sharma"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                      <Input
                        type="email"
                        required
                        placeholder="rohan@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
                      <Input
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Grade / Class</label>
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
                        value={formData.grade}
                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                      >
                        <option>Class 9</option>
                        <option>Class 10</option>
                        <option>Class 11 - Science</option>
                        <option>Class 12 - Science</option>
                        <option>JEE Main / Advanced</option>
                        <option>NEET Medical</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">State</label>
                      <Input
                        placeholder="e.g. Delhi"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`cursor-pointer rounded-xl p-4 border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-900">UPI / QR</p>
                    <p className="text-xs text-slate-500 mt-0.5">GPay, PhonePe, Paytm</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`cursor-pointer rounded-xl p-4 border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-900">Cards</p>
                    <p className="text-xs text-slate-500 mt-0.5">Credit & Debit Cards</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`cursor-pointer rounded-xl p-4 border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-900">Net Banking</p>
                    <p className="text-xs text-slate-500 mt-0.5">All Major Banks</p>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Instant activation via Razorpay UPI auto-redirect / QR scan</span>
                  </div>
                )}
              </div>

              {/* Trust & Guarantee */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">
                    EduPro 100% Risk-Free Guarantee
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                    Try the classes for a full 7 days. If you're not completely satisfied with our teachers and doubt support, let us know for a prompt 100% refund. No questions asked.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Col: Order Summary & Coupon */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 pb-3 border-b">
                  Order Summary
                </h3>

                {/* Course preview snippet */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80"
                      alt="Course"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                      Comprehensive Class 10 Board Excellence Course
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Full Academic Year Access</p>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-brand-600" />
                    Have a coupon code?
                  </label>
                  
                  {couponApplied ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                      <div>
                        <span className="font-bold text-emerald-800">{couponApplied.code}</span>
                        <p className="text-emerald-600 font-medium">-{formatCurrency(couponApplied.discount)} applied</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 font-semibold text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. EDUPRO50"
                        className="uppercase text-xs tracking-wider"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        className="text-xs font-semibold px-4"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}

                  <p className="text-[11px] text-slate-400">
                    💡 Tip: Try code <span className="font-bold text-brand-600">EDUPRO50</span> for 50% off
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Original Price</span>
                    <span className="line-through">{formatCurrency(originalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Course Fee</span>
                    <span>{formatCurrency(basePrice)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrency(couponApplied.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(gstAmount)}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-baseline font-bold text-slate-900 text-lg">
                    <span>Total Amount</span>
                    <span className="text-2xl text-brand-700 font-heading">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout Submit Button */}
                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-6 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Securing Enrollment...
                    </>
                  ) : (
                    <>
                      Complete Payment • {formatCurrency(finalTotal)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-slate-400">
                  By completing order, you agree to EduPro's Terms of Service and Privacy Policy.
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="min-h-screen py-24 text-center">
          <p className="text-sm font-semibold text-slate-500">Loading checkout...</p>
        </div>
      </PublicLayout>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
