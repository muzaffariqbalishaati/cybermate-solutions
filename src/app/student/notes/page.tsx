'use client';

import { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookMarked,
  Search,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  Maximize2,
  Minimize2,
  Calendar,
  Layers,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/cn';

interface StudyNote {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade: string | null;
  chapter: string | null;
  fileUrl: string;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  driveFileId: string | null;
  isFree: boolean;
  downloads: number;
  createdAt: string;
  course?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export default function StudentNotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Preview Modal state
  const [previewNote, setPreviewNote] = useState<StudyNote | null>(null);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.set('subject', selectedSubject);

      const res = await fetch(`/api/notes?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data.notes || []);
        if (data.data.subjects?.length) {
          setSubjects(data.data.subjects);
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load study notes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note: StudyNote) => {
    try {
      // Trigger download tracking
      const res = await fetch(`/api/notes/${note.id}/download`, { method: 'POST' });
      const data = await res.json();

      // Update local download count
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n))
      );

      const downloadUrl = data.data?.downloadUrl || note.fileUrl;

      // Open download in new window/trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = note.fileName || `${note.title}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: 'Download Started! 📥',
        description: `Downloading ${note.title}...`,
      });
    } catch {
      window.open(note.fileUrl, '_blank');
    }
  };

  // Format file size
  const formatBytes = (bytes: number | null) => {
    if (!bytes) return 'PDF Document';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Filter notes by search query
  const filteredNotes = notes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.description && n.description.toLowerCase().includes(q)) ||
      n.subject.toLowerCase().includes(q) ||
      (n.chapter && n.chapter.toLowerCase().includes(q)) ||
      (n.course?.title && n.course.title.toLowerCase().includes(q))
    );
  });

  // Get preview embed URL for Google Drive or direct file
  const getEmbedUrl = (note: StudyNote) => {
    if (note.driveFileId) {
      return `https://drive.google.com/file/d/${note.driveFileId}/preview`;
    }
    if (note.fileUrl.includes('drive.google.com')) {
      const match = note.fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return note.fileUrl;
  };

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-xl shadow-brand-500/10">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CyberMate Study Material & Notes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Study Notes & PDF Library
            </h1>
            <p className="text-sm sm:text-base text-white/90">
              Download chapter-wise handwritten revision notes, formula sheets, and study materials curated by expert teachers.
            </p>
          </div>
        </div>

        {/* Search & Subject Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes by title, topic, subject, or chapter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedSubject('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                selectedSubject === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              All Subjects ({notes.length})
            </button>
            {subjects.map((sub) => {
              const count = notes.filter((n) => n.subject.toLowerCase() === sub.toLowerCase()).length;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                    selectedSubject === sub
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {sub} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="skeleton h-5 w-24 rounded-full" />
                  <div className="skeleton h-4 w-16" />
                </div>
                <div className="skeleton h-6 w-3/4 rounded" />
                <div className="skeleton h-12 w-full rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="skeleton h-9 flex-1 rounded-lg" />
                  <div className="skeleton h-9 flex-1 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-brand-600">
              <BookMarked className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">No Study Notes Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? `No notes matching "${search}". Try searching for another topic or subject.`
                  : 'No notes uploaded for this category yet. Check back soon!'}
              </p>
            </div>
            {(search || selectedSubject !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedSubject('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              const isDrive = Boolean(note.driveFileId || note.fileUrl.includes('drive.google.com'));

              return (
                <div
                  key={note.id}
                  className="card p-5 flex flex-col justify-between hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                        {note.subject}
                      </span>

                      {isDrive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <svg className="w-3 h-3" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                          </svg>
                          Drive
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-muted-foreground uppercase">
                          {note.fileType || 'PDF'}
                        </span>
                      )}
                    </div>

                    {/* Note Title */}
                    <div>
                      <h3 className="font-heading font-bold text-base text-foreground group-hover:text-brand-600 transition-colors line-clamp-2">
                        {note.title}
                      </h3>
                      {note.chapter && (
                        <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {note.chapter}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {note.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {note.description}
                      </p>
                    )}

                    {/* Metadata Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {formatBytes(note.fileSize)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {note.downloads} downloads
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewNote(note)}
                      className="text-xs font-semibold h-9"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      Preview
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleDownload(note)}
                      className="text-xs font-semibold h-9 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* In-App PDF / Document Preview Modal */}
        {previewNote && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div
              className={cn(
                'bg-card border shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all',
                fullscreenPreview ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[85vh]'
              )}
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex items-center justify-between gap-3 bg-muted/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-sm truncate">{previewNote.title}</h4>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {previewNote.subject} {previewNote.chapter && `• ${previewNote.chapter}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(previewNote)}
                    className="text-xs h-8 px-2.5"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullscreenPreview(!fullscreenPreview)}
                    className="h-8 w-8 p-0"
                    title={fullscreenPreview ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {fullscreenPreview ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewNote(null);
                      setFullscreenPreview(false);
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Content - Embedded Viewer */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative">
                <iframe
                  src={getEmbedUrl(previewNote)}
                  className="w-full h-full border-0"
                  title={previewNote.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t bg-card flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Study Material • CyberMate Solutions
                </span>
                {previewNote.driveFileId && (
                  <a
                    href={`https://drive.google.com/file/d/${previewNote.driveFileId}/view`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open in Google Drive <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
