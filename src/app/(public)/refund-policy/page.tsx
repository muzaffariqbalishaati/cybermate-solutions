import { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCcw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | CyberMate Solutions',
  description: 'Understand the refund, cancellation, and student satisfaction guarantee at CyberMate Solutions.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="section-container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
                Refund & Cancellation Policy
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated: {lastUpdated} • CyberMate Solutions
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="card p-6 sm:p-10 space-y-8 bg-card shadow-sm border text-foreground leading-relaxed text-sm sm:text-base">
          {/* Guarantee Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                7-Day Student Satisfaction Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We are confident in the pedagogical quality of our educators. If you are not satisfied with your course within 7 days of purchase and have consumed less than 25% of course content, you are entitled to a full refund.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> 1. Eligibility Criteria for Refund
            </h2>
            <p className="text-muted-foreground">
              To be eligible for a refund under our 7-day policy:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li>The refund request must be lodged within <b>7 calendar days</b> from the date of enrollment.</li>
              <li>You must have completed less than <b>25%</b> of the course curriculum (recorded lectures / modules).</li>
              <li>No course completion certificate has been generated or issued for the course.</li>
              <li>The course was not purchased through a promotional flash sale marked explicitly as non-refundable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> 2. How to Request a Refund
            </h2>
            <p className="text-muted-foreground">
              Requesting a refund is simple and completely transparent:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Log in to your <b>Student Portal</b> and navigate to <b>Orders & Invoices</b>.</li>
              <li>Select the order you wish to refund and click <b>"Request Refund"</b>.</li>
              <li>Provide your reason and submit the request.</li>
              <li>Alternatively, email our finance desk at <a href="mailto:billing@cybermatesolutions.com" className="text-brand-600 font-semibold underline">billing@cybermatesolutions.com</a> with your Order ID.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> 3. Processing Timeline
            </h2>
            <p className="text-muted-foreground">
              Once approved by our academic review team (usually within 24 to 48 hours), refunds are processed directly back to the original payment method used during checkout (Credit/Debit Card, Net Banking, or UPI) via Razorpay. It typically takes <b>5 to 7 business days</b> for the funds to reflect in your bank account, depending on your bank's settlement cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> 4. Live Batch Cancellations
            </h2>
            <p className="text-muted-foreground">
              In the unlikely event that a scheduled live batch is cancelled or discontinued by CyberMate Solutions prior to completion, enrolled students will receive a 100% full refund or free migration to an alternate batch of their choice.
            </p>
          </section>

          <section className="space-y-3 border-t pt-6">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> 5. Questions or Billing Assistance?
            </h2>
            <div className="p-4 rounded-xl bg-muted/40 space-y-1 text-sm font-medium">
              <p>CyberMate Solutions Billing & Help Desk</p>
              <p>Email: <a href="mailto:support@cybermatesolutions.com" className="text-brand-600 hover:underline">support@cybermatesolutions.com</a></p>
              <p>Helpline: <a href="tel:+919934215013" className="text-brand-600 hover:underline">+91 9934215013</a> (10:00 AM – 7:00 PM IST)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
