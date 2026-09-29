'use client';

import { useState, useEffect, useRef } from 'react';
import { TeacherLayout } from '@/components/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookMarked,
  Plus,
  Search,
  Upload,
  ExternalLink,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  FileText,
  HardDrive,
  Download,
  X,
  Sparkles,
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
  isPublished: boolean;
  downloads: number;
  createdAt: string;
  course?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface CourseOption {
  id: string;
  title: string;
}

const COMMON_SUBJECTS = [
  'Web Development',
  'Python Programming',
  'Computer Science',
  'Data Structures & Algorithms',
  'Digital Marketing',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English & Communication',
];

export default function TeacherNotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(COMMON_SUBJECTS[0]);
  const [grade, setGrade] = useState('');
  const [chapter, setChapter] = useState('');
  const [courseId, setCourseId] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [externalLink, setExternalLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNotes();
    fetchCourses();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (data.success) {
        setNotes(data.data.notes || []);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load study notes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(
          (data.data.courses || data.data || []).map((c: any) => ({
            id: c.id,
            title: c.title,
          }))
        );
      }
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }

    if (!selectedFile && !externalLink.trim()) {
      toast({
        title: 'File Required',
        description: 'Please upload a PDF file or provide a Google Drive link.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subject', subject);
      formData.append('grade', grade);
      formData.append('chapter', chapter);
      if (courseId) formData.append('courseId', courseId);
      formData.append('isFree', String(isFree));
      formData.append('isPublished', 'true');

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (externalLink) {
        formData.append('externalLink', externalLink);
      }

      const res = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Notes Shared! 🚀',
          description: 'Study material uploaded and made available for students.',
        });
        setModalOpen(false);
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setExternalLink('');
        fetchNotes();
      } else {
        throw new Error(data.error || 'Failed to upload note');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return 'PDF';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredNotes = notes.filter((n) => {
    if (!search) return true;
    return (
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      (n.chapter && n.chapter.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <TeacherLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Study Notes & PDF Materials
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload and share chapter notes, formula sheets, and study materials with your students.
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            variant="gradient"
            className="shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Upload Study Material
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your notes by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-card text-sm"
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="skeleton h-5 w-24 rounded-full" />
                <div className="skeleton h-6 w-3/4 rounded" />
                <div className="skeleton h-10 w-full rounded" />
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto space-y-4">
            <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-heading font-bold text-base">No Study Notes Yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first lecture notes or formula sheet to help your students revise.
              </p>
            </div>
            <Button size="sm" variant="gradient" onClick={() => setModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Upload Note Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              const isDrive = Boolean(note.driveFileId || note.fileUrl.includes('drive.google.com'));

              return (
                <div key={note.id} className="card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                        {note.subject}
                      </span>
                      {isDrive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <HardDrive className="w-3 h-3" /> Drive
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-base text-foreground line-clamp-2">
                      {note.title}
                    </h3>

                    {note.chapter && (
                      <p className="text-xs text-brand-600 font-medium">Chapter: {note.chapter}</p>
                    )}

                    {note.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{note.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                    <span>{formatBytes(note.fileSize)}</span>
                    <span className="font-semibold text-brand-600 flex items-center gap-1">
                      <Download className="w-3 h-3" /> {note.downloads} downloads
                    </span>
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-card z-10">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-brand-600" />
                  <h3 className="font-heading font-bold text-base">Upload Study Notes for Students</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Note Title *</label>
                  <Input
                    type="text"
                    placeholder="e.g. Chapter 3: Formula Sheet & Practice Questions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Subject</label>
                    <input
                      list="teacher-subjects"
                      className="form-input text-sm w-full"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                    <datalist id="teacher-subjects">
                      {COMMON_SUBJECTS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Course (Optional)</label>
                    <select
                      className="form-input text-sm w-full"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                    >
                      <option value="">General (All Students)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Chapter Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Chapter 3: Kinematics"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <textarea
                    rows={2}
                    className="form-input text-sm resize-none w-full"
                    placeholder="Brief description of these notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Upload File / Google Drive Link */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-foreground">Document File / Google Drive Link</label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors',
                      selectedFile
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-slate-300 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40'
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
                        }
                      }}
                    />
                    {selectedFile ? (
                      <div className="space-y-1 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-7 h-7 mx-auto" />
                        <p className="text-xs font-bold">{selectedFile.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-muted-foreground">
                        <Upload className="w-6 h-6 mx-auto text-brand-600" />
                        <p className="text-xs font-semibold text-foreground">Click to upload PDF Note</p>
                        <p className="text-[11px]">PDF, Word, or PowerPoint (Google Drive Cloud Saved)</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Or Paste Google Drive Link</label>
                    <Input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" loading={submitting}>
                    Upload & Share
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
