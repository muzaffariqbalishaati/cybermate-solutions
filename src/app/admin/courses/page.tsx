'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, BookOpen, X, Check } from 'lucide-react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  price: number;
  salePrice: number | null;
  featured: boolean;
  popular: boolean;
  subject: string | null;
  grade: string | null;
  validity?: number | null;
  createdAt: string;
  category: { name: string } | null;
  _count: { enrollments: number };
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'badge-success',
  DRAFT: 'badge-warning',
  ARCHIVED: 'badge',
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('10');
  const [price, setPrice] = useState(2999);
  const [salePrice, setSalePrice] = useState<number | ''>(1999);
  const [courseStatus, setCourseStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [popular, setPopular] = useState(false);
  const [validity, setValidity] = useState(365);

  useEffect(() => {
    fetchCourses();
  }, [search, status, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });
      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch courses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setSubject('Science');
    setGrade('10');
    setPrice(2999);
    setSalePrice(1999);
    setCourseStatus('PUBLISHED');
    setShortDesc('');
    setDescription('');
    setFeatured(false);
    setPopular(false);
    setValidity(365);
    setModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setTitle(c.title);
    setSubject(c.subject || '');
    setGrade(c.grade || '10');
    setPrice(c.price);
    setSalePrice(c.salePrice !== null ? c.salePrice : '');
    setCourseStatus(c.status);
    setShortDesc(c.shortDesc || '');
    setDescription(c.description || '');
    setFeatured(c.featured);
    setPopular(c.popular);
    setValidity(c.validity || 365);
    setModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) {
      toast({ title: 'Validation Error', description: 'Title must be at least 3 characters', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        subject: subject.trim() || undefined,
        grade: grade || undefined,
        price: Number(price),
        salePrice: salePrice !== '' ? Number(salePrice) : null,
        status: courseStatus,
        shortDesc: shortDesc.trim() || undefined,
        description: description.trim() || undefined,
        featured,
        popular,
        validity: Number(validity) || 365,
      };

      const url = editingCourse ? `/api/courses/${editingCourse.slug}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save course');
      }

      toast({
        title: editingCourse ? 'Course Updated! 📚' : 'Course Created! 🎉',
        description: `"${title}" has been successfully saved.`,
      });

      setModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/courses/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted', description: `"${courseTitle}" has been deleted` });
        fetchCourses();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' });
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">Courses</h1>
            <p className="text-sm text-muted-foreground">{total} total courses in catalog</p>
          </div>
          <Button variant="gradient" onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Course
          </Button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-input w-auto text-sm"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Course Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingCourse ? 'Update curriculum and pricing' : 'Publish a new course to your online platform'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course Title *</label>
                  <Input
                    required
                    placeholder="e.g. Class 10 Mathematics - Complete CBSE Board Mastery"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Subject</label>
                    <Input
                      placeholder="e.g. Mathematics"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Class / Grade</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white"
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                    >
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white"
                      value={courseStatus}
                      onChange={e => setCourseStatus(e.target.value as any)}
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Regular Price (₹) *</label>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Sale Price (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Optional discount price"
                      value={salePrice}
                      onChange={e => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Validity (Days)</label>
                    <Input
                      type="number"
                      min="1"
                      value={validity}
                      onChange={e => setValidity(Number(e.target.value))}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Short Summary</label>
                  <Input
                    placeholder="Brief 1-line headline for cards"
                    value={shortDesc}
                    onChange={e => setShortDesc(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed course overview, syllabus outline, key highlights..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={e => setFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    Featured on Homepage
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={popular}
                      onChange={e => setPopular(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    Mark as Popular
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving} className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs">
                    {editingCourse ? 'Save Changes' : 'Publish Course'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No courses found
                    </td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id}>
                      <td className="max-w-[280px]">
                        <div className="font-medium text-sm text-slate-900">{course.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {[course.subject, course.grade && `Class ${course.grade}`].filter(Boolean).join(' • ')}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {course.featured && <span className="badge-primary text-xs">Featured</span>}
                          {course.popular && <span className="badge bg-amber-50 text-amber-600 border-amber-200 text-xs">Popular</span>}
                        </div>
                      </td>
                      <td className="text-sm text-muted-foreground">{course.category?.name || 'General'}</td>
                      <td>
                        <div className="text-sm font-medium text-slate-900">
                          {course.salePrice !== null ? formatCurrency(course.salePrice) : formatCurrency(course.price)}
                        </div>
                        {course.salePrice !== null && course.price !== course.salePrice && (
                          <div className="text-xs text-muted-foreground line-through">{formatCurrency(course.price)}</div>
                        )}
                      </td>
                      <td className="text-sm font-semibold">{course._count.enrollments.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={statusColors[course.status] || 'badge'}>
                          {course.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground">{formatDate(course.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild title="Preview Course">
                            <Link href={`/courses/${course.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(course)}
                            title="Edit Course"
                          >
                            <Edit className="h-4 w-4 text-brand-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(course.slug, course.title)}
                            title="Delete Course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
