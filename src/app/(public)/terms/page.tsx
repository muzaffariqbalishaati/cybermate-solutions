import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CyberMate Solutions',
  description: 'Read the terms and conditions for enrolling in and using the CyberMate Solutions online learning platform.',
};

export default function TermsPage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="section-container max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated: {lastUpdated} • CyberMate Solutions
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="card p-6 sm:p-10 space-y-8 bg-card shadow-sm border text-foreground leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using the website, mobile portal, live classes, course materials, or any educational services provided by <b>CyberMate Solutions</b>, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, please refrain from using our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 2. Student Accounts & Security
            </h2>
            <p className="text-muted-foreground">
              When creating an account on CyberMate Solutions, you must provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your credentials and password. Sharing account access with multiple unauthorized users is strictly prohibited and may result in immediate suspension without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 3. Course Access & Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              All learning content, recorded video lectures, live streams, study notes, question banks, assignments, and software tools provided on CyberMate Solutions are the proprietary intellectual property of CyberMate Solutions.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li>Enrolled students are granted a non-exclusive, non-transferable personal license to view course materials.</li>
              <li>You may not redistribute, screen record, sell, or broadcast any video lectures or copyrighted study notes.</li>
              <li>Violation of intellectual property rights will lead to legal action under applicable copyright legislation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 4. Fees, Payments & GST
            </h2>
            <p className="text-muted-foreground">
              Course fees, subscription amounts, and applicable taxes (GST) are clearly stated at checkout. All payments are securely processed through certified payment gateways (e.g. Razorpay). Access to enrolled courses is activated immediately upon successful transaction verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 5. Live Classes & Code of Conduct
            </h2>
            <p className="text-muted-foreground">
              Students and teachers participating in interactive live studio sessions, doubts queues, and forums are expected to maintain professional courtesy. Abusive language, harassment, spamming, or disruptive behavior will result in permanent expulsion from live sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 6. Certification & Verification
            </h2>
            <p className="text-muted-foreground">
              Course completion certificates are issued to students who fulfill attendance criteria, pass required module tests, and submit designated projects. Each certificate comes with a unique verification code that can be verified publicly on our certificate validation portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              CyberMate Solutions strives for 99.9% platform uptime and high-quality educational delivery. However, we cannot be held liable for temporary interruptions caused by scheduled maintenance, third-party network outages, or hardware limitations on the student's device.
            </p>
          </section>

          <section className="space-y-3 border-t pt-6">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> 8. Contact & Legal Support
            </h2>
            <p className="text-muted-foreground">
              If you have any questions or grievances regarding these terms, please contact our administrative team at:
            </p>
            <div className="p-4 rounded-xl bg-muted/40 space-y-1 text-sm font-medium">
              <p>CyberMate Solutions Grievance Officer</p>
              <p>Email: <a href="mailto:support@cybermatesolutions.com" className="text-brand-600 hover:underline">support@cybermatesolutions.com</a></p>
              <p>Phone: <a href="tel:+919934215013" className="text-brand-600 hover:underline">+91 9934215013</a></p>
              <p>Address: New Delhi, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
