'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Save, Eye, EyeOff, GripVertical, Settings, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface HomepageSection {
  id: string;
  sectionKey: string;
  title: string | null;
  content: Record<string, unknown>;
  order: number;
  isVisible: boolean;
}

const sectionLabels: Record<string, { label: string; desc: string }> = {
  announcement_bar: { label: 'Announcement Bar', desc: 'Top banner with important message' },
  hero: { label: 'Hero Section', desc: 'Main headline, CTA buttons and background' },
  statistics: { label: 'Statistics', desc: 'Student count, courses, teachers etc.' },
  featured_courses: { label: 'Featured Courses', desc: 'Showcase highlighted courses' },
  categories: { label: 'Course Categories', desc: 'Browse by category section' },
  why_choose_us: { label: 'Why Choose Us', desc: 'Feature highlights and benefits' },
  teachers: { label: 'Teachers Section', desc: 'Featured teacher profiles' },
  testimonials: { label: 'Testimonials', desc: 'Student reviews and success stories' },
  faq: { label: 'FAQ Section', desc: 'Frequently asked questions' },
  cta: { label: 'Call to Action', desc: 'Bottom CTA section' },
};

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (data.success) setSections(data.data.sort((a: HomepageSection, b: HomepageSection) => a.order - b.order));
    } catch {
      toast({ title: 'Error', description: 'Failed to load sections', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (section: HomepageSection) => {
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey: section.sectionKey, isVisible: !section.isVisible }),
      });
      if (res.ok) {
        setSections(prev =>
          prev.map(s => s.sectionKey === section.sectionKey ? { ...s, isVisible: !s.isVisible } : s)
        );
        toast({ title: section.isVisible ? 'Section hidden' : 'Section visible' });
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const saveSection = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: editingSection.sectionKey,
          content: editingSection.content,
        }),
      });
      if (res.ok) {
        toast({ title: 'Section saved!', variant: 'default' });
        setSections(prev =>
          prev.map(s => s.sectionKey === editingSection.sectionKey ? editingSection : s)
        );
        setEditingSection(null);
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">Homepage Editor</h1>
            <p className="text-sm text-muted-foreground">Manage homepage sections, content and visibility</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/" target="_blank"><Globe className="h-4 w-4" /> Preview Site</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections List */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Sections</h3>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sections.map(section => {
                    const meta = sectionLabels[section.sectionKey] || { label: section.sectionKey, desc: '' };
                    return (
                      <div
                        key={section.sectionKey}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${editingSection?.sectionKey === section.sectionKey ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}
                        onClick={() => setEditingSection(section)}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{meta.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{meta.desc}</div>
                        </div>
                        <button
                          className={`p-1 rounded transition-colors ${section.isVisible ? 'text-emerald-500 hover:text-emerald-600' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={(e) => { e.stopPropagation(); toggleVisibility(section); }}
                          title={section.isVisible ? 'Hide section' : 'Show section'}
                        >
                          {section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section Editor */}
          <div className="lg:col-span-2">
            {editingSection ? (
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{sectionLabels[editingSection.sectionKey]?.label || editingSection.sectionKey}</h3>
                  <Button onClick={saveSection} loading={saving} variant="gradient" size="sm">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>

                {/* Dynamic content editor */}
                <div className="space-y-4">
                  {Object.entries(editingSection.content as Record<string, string>).map(([key, value]) => {
                    if (typeof value === 'object') return null; // Skip nested objects for now
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    return (
                      <div key={key}>
                        <label className="form-label mb-1.5 block capitalize">{label}</label>
                        {key.includes('text') && value?.length > 80 ? (
                          <textarea
                            className="form-input h-24 resize-none"
                            value={value}
                            onChange={e => setEditingSection(prev => prev ? {
                              ...prev,
                              content: { ...prev.content, [key]: e.target.value },
                            } : null)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="form-input"
                            value={value || ''}
                            onChange={e => setEditingSection(prev => prev ? {
                              ...prev,
                              content: { ...prev.content, [key]: e.target.value },
                            } : null)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-16 text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a section from the left to edit its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
