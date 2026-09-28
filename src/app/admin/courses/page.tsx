'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  salePrice: number | null;
  featured: boolean;
  popular: boolean;
  subject: string | null;
  grade: string | null;
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

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/courses/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted', description: `"${title}" has been deleted`, variant: 'default' });
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
            <p className="text-sm text-muted-foreground">{total} total courses</p>
          </div>
          <Button variant="gradient" asChild>
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-input h-10 w-36"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Enrollments</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
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
                      <td>
                        <div className="font-medium text-sm">{course.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {[course.subject, course.grade && `Class ${course.grade}`].filter(Boolean).join(' • ')}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {course.featured && <span className="badge-primary text-xs">Featured</span>}
                          {course.popular && <span className="badge bg-amber-50 text-amber-600 border-amber-200 text-xs">Popular</span>}
                        </div>
                      </td>
                      <td className="text-sm text-muted-foreground">{course.category?.name || '—'}</td>
                      <td>
                        <div className="text-sm font-medium">
                          {course.salePrice !== null ? formatCurrency(course.salePrice) : formatCurrency(course.price)}
                        </div>
                        {course.salePrice !== null && course.price !== course.salePrice && (
                          <div className="text-xs text-muted-foreground line-through">{formatCurrency(course.price)}</div>
                        )}
                      </td>
                      <td className="text-sm">{course._count.enrollments.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={statusColors[course.status] || 'badge'}>
                          {course.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground">{formatDate(course.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/courses/${course.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/courses/${course.slug}`}><Edit className="h-4 w-4" /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(course.slug, course.title)}
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
