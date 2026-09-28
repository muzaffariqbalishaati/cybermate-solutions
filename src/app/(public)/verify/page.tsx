'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck, Award, Search, CheckCircle2,
  Calendar, FileText, ArrowRight, Sparkles
} from 'lucide-react';

export default function VerifyPortalPage() {
  const [certNo, setCertNo] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certNo.trim()) {
      router.push(`/verify/${encodeURIComponent(certNo.trim().toUpperCase())}`);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="section-container max-w-4xl">
          
          <div className="text-center space-y-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-9 h-9" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900">
              Official Certificate Verification Portal
            </h1>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Verify the authenticity of graduation credentials and certificates issued by EduPro Learning Platform.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Enter Certificate Identification Number (CIN)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <Input
                    required
                    placeholder="e.g. CERT-2025-849201"
                    className="pl-11 h-12 uppercase tracking-wider font-mono text-sm"
                    value={certNo}
                    onChange={e => setCertNo(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Verify Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Try demo verification ID:{' '}
                <button
                  type="button"
                  onClick={() => setCertNo('CERT-2025-1049281')}
                  className="text-brand-600 font-semibold underline"
                >
                  CERT-2025-1049281
                </button>
              </p>
            </form>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Security & Verification Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-proof digital ledger signatures</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct QR code validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permanent institutional record</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Shareable with schools & colleges</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
