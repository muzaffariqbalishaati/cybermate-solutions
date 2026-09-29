import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | CyberMate Solutions',
  description: 'Understand how CyberMate Solutions protects, collects, and secures student data and privacy.',
};

export default function PrivacyPolicyPage() {
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
                Privacy Policy
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
              <Lock className="w-5 h-5 text-brand-600" /> 1. Commitment to Privacy
            </h2>
            <p className="text-muted-foreground">
              At <b>CyberMate Solutions</b>, we value your trust and are committed to protecting the personal data of our students, parents, teachers, and visitors. This Privacy Policy outlines what information we collect, how it is safeguarded, and how you can exercise control over your personal records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 2. Information We Collect
            </h2>
            <p className="text-muted-foreground">
              We collect information to deliver a smooth and personalized educational experience:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li><b>Account Details:</b> Full name, email address, contact phone number, date of birth, grade/standard.</li>
              <li><b>Learning Analytics:</b> Course progress, lecture view durations, test scores, homework submissions, and attendance logs.</li>
              <li><b>Billing Data:</b> Order ID, billing address, and transaction confirmation. (Note: We <i>never</i> store your debit/credit card numbers or UPI PINs; transactions are encrypted directly via Razorpay).</li>
              <li><b>Technical Logs:</b> IP address, browser type, device information, and error diagnostics for platform performance optimization.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3. How We Use Your Data
            </h2>
            <p className="text-muted-foreground">
              Your information is exclusively used for educational and administrative operations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li>Facilitating enrollment in live tuition classes and self-paced video modules.</li>
              <li>Allowing teachers to grade assignments and respond to student doubts.</li>
              <li>Sending transactional notifications, class reminders, and certificate issuance updates via SMS/Email/WhatsApp.</li>
              <li>Ensuring platform integrity and preventing fraud or account duplication.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 4. Data Sharing & Third Parties
            </h2>
            <p className="text-muted-foreground">
              <b>We do not sell, rent, or trade your personal information to third-party advertisers.</b> We only share data with certified service providers essential to service delivery:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li><b>Payment Processing:</b> Razorpay for PCI-DSS compliant secure checkout.</li>
              <li><b>Cloud Storage:</b> Google Drive & Supabase Cloud for encrypted file and video content storage.</li>
              <li><b>Live Video Streaming:</b> Secure WebRTC and Zoom/Google Meet APIs for live classroom sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 5. Data Security & Encryption
            </h2>
            <p className="text-muted-foreground">
              All communications between your device and CyberMate Solutions servers are encrypted using TLS 1.3 / SSL standards. Passwords are mathematically hashed with bcrypt, and sensitive operations require secure JSON Web Token authentication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 6. Student & Parent Rights
            </h2>
            <p className="text-muted-foreground">
              You have the right to inspect, modify, or request deletion of your account profile. Parents linked to a student account can monitor attendance and performance reports through the designated Parent Portal.
            </p>
          </section>

          <section className="space-y-3 border-t pt-6">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 7. Privacy Inquiries
            </h2>
            <p className="text-muted-foreground">
              For any privacy inquiries or data requests, please write to our privacy team:
            </p>
            <div className="p-4 rounded-xl bg-muted/40 space-y-1 text-sm font-medium">
              <p>Email: <a href="mailto:privacy@cybermatesolutions.com" className="text-brand-600 hover:underline">privacy@cybermatesolutions.com</a></p>
              <p>Helpline: <a href="tel:+919934215013" className="text-brand-600 hover:underline">+91 9934215013</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
