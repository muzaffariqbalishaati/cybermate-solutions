import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { BookOpen, Download, ArrowRight, Sparkles, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free Study Resources & Notes | CyberMate Solutions',
  description: 'Download free programming cheatsheets, formula books, chapter notes, and sample problem sets.',
};

export const revalidate = 60; // 60s cache

export default async function ResourcesPage() {
  let freeNotes: any[] = [];
  try {
    freeNotes = await prisma.studyNote.findMany({
      where: { isPublished: true, isFree: true },
      include: {
        course: { select: { title: true } },
      },
      orderBy: { downloads: 'desc' },
      take: 12,
    });
  } catch {
    freeNotes = [];
  }

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return 'PDF';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="section-container max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 text-xs font-semibold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free Educational Resources
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-foreground tracking-tight">
            Free Study Materials & Notes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Download hand-written chapter summaries, formula books, cheatsheets, and interview problem sets curated by CyberMate Solutions faculty.
          </p>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeNotes.map((note) => (
            <div
              key={note.id}
              className="card p-6 flex flex-col justify-between hover:shadow-xl hover:border-brand-400 dark:hover:border-brand-600 transition-all group bg-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {note.subject}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatBytes(note.fileSize)}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-brand-600 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                {note.chapter && (
                  <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
                    Chapter: {note.chapter}
                  </p>
                )}

                {note.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {note.downloads} downloads
                </span>
                <Button size="sm" variant="gradient" className="text-xs font-semibold" asChild>
                  <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                    Download PDF <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="card p-8 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-center space-y-4 shadow-xl rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold">
            Want Full Access to Live Classes & Tests?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Enroll in our complete batches to get daily live interactive sessions, 24/7 doubt clearing, homework correction, and verified completion certificates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-white/90 font-bold w-full sm:w-auto" asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/demo">Book Free Demo Class</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
