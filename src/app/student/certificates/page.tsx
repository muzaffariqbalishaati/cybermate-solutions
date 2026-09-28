'use client';

import { StudentLayout } from '@/components/layouts/student-layout';
import Link from 'next/link';
import { Award, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const mockCertificates = [
  {
    id: 'cert-1',
    certificateNo: 'CERT-2025-1049281',
    courseTitle: 'Advanced Mechanics & Calculus - Physics Mastery',
    grade: 'A+ (94.2% Distinction)',
    issueDate: '15 March 2025',
    instructor: 'Prof. Vikram Malhotra',
  },
  {
    id: 'cert-2',
    certificateNo: 'CERT-2025-8829104',
    courseTitle: 'Complete Chemical Bonding & Molecular Structure Foundation',
    grade: 'A (89.5%)',
    issueDate: '10 January 2025',
    instructor: 'Meenakshi Iyer',
  },
];

export default function StudentCertificatesPage() {
  return (
    <StudentLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              My Certifications
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Official verifiable certificates for all your completed courses
            </p>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockCertificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border-2 border-amber-200/80 p-8 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              {/* Corner ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/20 to-transparent pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                    <Award className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ID: {cert.certificateNo}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Verified Credential
                  </span>
                  <h3 className="font-heading font-bold text-slate-900 text-xl mt-2 leading-snug">
                    {cert.courseTitle}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t pt-3">
                  <p>
                    <span className="font-semibold text-slate-800">Honors Standing:</span>{' '}
                    <span className="font-bold text-emerald-700">{cert.grade}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Lead Faculty:</span>{' '}
                    {cert.instructor}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued on {cert.issueDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex flex-wrap gap-3">
                <Link
                  href={`/verify/${cert.certificateNo}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    Verify Online
                  </Button>
                </Link>

                <Button
                  onClick={() => toast({ title: 'Download Triggered', description: 'Generating high-resolution certificate PDF...' })}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </Button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
}
