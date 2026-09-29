'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
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
  AlertCircle,
  FileText,
  HardDrive,
  Download,
  Filter,
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
  'General Knowledge',
];

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [chapter, setChapter] = useState('');
  const [courseId, setCourseId] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
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
      // Ignore if courses endpoint format varies
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject(COMMON_SUBJECTS[0]);
    setGrade('');
    setChapter('');
    setCourseId('');
    setIsFree(true);
    setIsPublished(true);
    setExternalLink('');
    setSelectedFile(null);
    setEditingNote(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (note: StudyNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description || '');
    setSubject(note.subject);
    setGrade(note.grade || '');
    setChapter(note.chapter || '');
    setCourseId(note.course?.id || '');
    setIsFree(note.isFree);
    setIsPublished(note.isPublished);
    setExternalLink(note.fileUrl);
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }

    if (!editingNote && !selectedFile && !externalLink.trim()) {
      toast({
        title: 'File Required',
        description: 'Please select a PDF file to upload or enter a Google Drive link.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingNote) {
        // Update existing note
        const res = await fetch(`/api/notes/${editingNote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            subject,
            grade,
            chapter,
            courseId: courseId || null,
            isFree,
            isPublished,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast({ title: 'Note Updated! ✅', description: `${title} updated successfully.` });
          setModalOpen(false);
          fetchNotes();
        } else {
          throw new Error(data.error || 'Failed to update note');
        }
      } else {
        // Create new note
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('chapter', chapter);
        if (courseId) formData.append('courseId', courseId);
        formData.append('isFree', String(isFree));
        formData.append('isPublished', String(isPublished));

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
            title: 'Note Uploaded! 🚀',
            description: 'Study material uploaded and published successfully.',
          });
          setModalOpen(false);
          fetchNotes();
        } else {
          throw new Error(data.error || 'Failed to upload note');
        }
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

  const handleDelete = async (id: string, noteTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${noteTitle}"?`)) return;

    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        toast({ title: 'Deleted', description: 'Study note removed successfully.' });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublish = async (note: StudyNote) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !note.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, isPublished: !n.isPublished } : n))
        );
        toast({
          title: note.isPublished ? 'Unpublished' : 'Published! 🟢',
          description: `Note is now ${note.isPublished ? 'hidden from' : 'visible to'} students.`,
        });
      }
    } catch {
      toast({ title: 'Error toggling publish status', variant: 'destructive' });
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return 'PDF';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      (n.chapter && n.chapter.toLowerCase().includes(search.toLowerCase()));

    const matchesSubject = filterSubject === 'all' || n.subject.toLowerCase() === filterSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloads || 0), 0);
  const driveSyncedCount = notes.filter((n) => n.driveFileId || n.fileUrl.includes('drive.google.com')).length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                Study Notes & Reference Materials
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Google Drive Synced
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Upload handwritten lecture notes, PDF formula sheets, and chapter summaries. Files are saved directly to Google Drive.
            </p>
          </div>

          <Button onClick={openCreateModal} variant="gradient" className="shadow-md shadow-brand-500/20">
            <Plus className="w-4 h-4 mr-1.5" /> Upload New Note
          </Button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Total Notes</span>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">{notes.length}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Total Downloads</span>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-600">{totalDownloads}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Google Drive Synced</span>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">{driveSyncedCount}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Published to Students</span>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-purple-600">
              {notes.filter((n) => n.isPublished).length}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, subject, or chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-card text-sm"
            />
          </div>

          <select
            className="form-input text-xs sm:text-sm sm:w-56"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {COMMON_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-heading font-bold text-base">No Study Notes Found</h3>
              <p className="text-xs text-muted-foreground">Click "Upload New Note" to add your first study material.</p>
              <Button size="sm" variant="gradient" onClick={openCreateModal}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Note Now
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Title & Chapter</th>
                    <th className="py-3 px-4">Subject & Course</th>
                    <th className="py-3 px-4">Storage</th>
                    <th className="py-3 px-4">Downloads</th>
                    <th className="py-3 px-4">Visibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredNotes.map((note) => {
                    const isDrive = Boolean(note.driveFileId || note.fileUrl.includes('drive.google.com'));

                    return (
                      <tr key={note.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{note.title}</div>
                          {note.chapter && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <span>Chapter: {note.chapter}</span>
                              {note.fileSize && <span>• {formatBytes(note.fileSize)}</span>}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                            {note.subject}
                          </span>
                          {note.course && (
                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                              {note.course.title}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {isDrive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <HardDrive className="w-3 h-3" /> Google Drive
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground font-mono">Server / Local</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs font-semibold text-foreground">
                          {note.downloads}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleTogglePublish(note)}
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all',
                              note.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                            )}
                          >
                            {note.isPublished ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={note.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-brand-600 hover:bg-muted"
                              title="Open file / Google Drive"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => openEditModal(note)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Edit note"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(note.id, note.title)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create / Edit Note Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-card z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base">
                      {editingNote ? 'Edit Study Note' : 'Upload New Study Note / Material'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Automatic Google Drive upload enabled for high-speed cloud storage.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Note Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Full Stack Web Development - Complete Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Subject & Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Subject / Topic</label>
                    <input
                      list="subjects-list"
                      className="form-input text-sm w-full"
                      placeholder="e.g. Web Development"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                    <datalist id="subjects-list">
                      {COMMON_SUBJECTS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Linked Course (Optional)</label>
                    <select
                      className="form-input text-sm w-full"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                    >
                      <option value="">No Course Link (General Note)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chapter & Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Chapter / Unit Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Chapter 1: Introduction to React"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Class / Grade / Level</label>
                    <Input
                      type="text"
                      placeholder="e.g. All Students / Intermediate"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description / Summary</label>
                  <textarea
                    rows={2}
                    className="form-input text-sm resize-none w-full"
                    placeholder="Brief summary of what this note covers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* File Upload / Google Drive Link */}
                {!editingNote && (
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-foreground">Upload Document / Google Drive Link</label>

                    {/* File Dropzone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors',
                        selectedFile
                          ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40'
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
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
                          <CheckCircle2 className="w-8 h-8 mx-auto" />
                          <p className="text-xs font-bold">{selectedFile.name}</p>
                          <p className="text-[11px] text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-muted-foreground">
                          <Upload className="w-7 h-7 mx-auto text-brand-600" />
                          <p className="text-xs font-semibold text-foreground">Click to upload PDF or Document</p>
                          <p className="text-[11px]">PDF, Word DOCX, PowerPoint PPT, or ZIP (Max 50MB)</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            ✨ Automatically saved to Google Drive
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="relative flex items-center justify-center my-2">
                      <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
                      <span className="bg-card px-2 text-[11px] text-muted-foreground font-semibold uppercase absolute">
                        OR
                      </span>
                    </div>

                    {/* Google Drive Link input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Paste Existing Google Drive Share Link</span>
                        <span className="text-[11px] text-brand-600 font-mono">drive.google.com</span>
                      </label>
                      <Input
                        type="url"
                        placeholder="https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border bg-muted/20">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold">Free for All Students</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border bg-muted/20">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold">Publish Immediately</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" loading={submitting}>
                    {editingNote ? 'Save Changes' : 'Upload & Publish Note'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
