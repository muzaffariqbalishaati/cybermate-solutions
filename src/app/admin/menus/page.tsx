'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Globe,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/cn';

interface MenuItemState {
  id?: string;
  label: string;
  url: string;
  order: number;
  target?: string;
  isActive?: boolean;
  isLegal?: boolean;
}

const COMMON_ROUTE_PRESETS = [
  { label: 'Home Page', url: '/' },
  { label: 'Courses Catalog', url: '/courses' },
  { label: 'Free Demo Class', url: '/demo' },
  { label: 'Study Resources & Notes', url: '/resources' },
  { label: 'About Us', url: '/about' },
  { label: 'Contact Us', url: '/contact' },
  { label: 'Certificate Verification', url: '/verify' },
  { label: 'Student Portal', url: '/student' },
  { label: 'Student Notes Library', url: '/student/notes' },
  { label: 'Student Login', url: '/login' },
  { label: 'Register Account', url: '/register' },
  { label: 'Terms & Conditions', url: '/terms' },
  { label: 'Privacy Policy', url: '/privacy' },
  { label: 'Refund Policy', url: '/refund-policy' },
  { label: 'FAQ Page', url: '/faq' },
];

export default function AdminMenusPage() {
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'homepage'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Header Menu Items
  const [headerItems, setHeaderItems] = useState<MenuItemState[]>([]);

  // Footer Items
  const [footerQuickItems, setFooterQuickItems] = useState<MenuItemState[]>([]);
  const [footerLegalItems, setFooterLegalItems] = useState<MenuItemState[]>([]);

  // Footer Settings
  const [footerSettings, setFooterSettings] = useState<Record<string, string>>({
    footer_about: '',
    contact_email: '',
    phone: '',
    whatsapp: '',
    address: '',
    copyright_text: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_youtube: '',
    social_linkedin: '',
  });

  // Homepage Links
  const [homepageLinks, setHomepageLinks] = useState({
    heroCtaText: 'Explore Courses',
    heroCtaUrl: '/courses',
    heroDemoText: 'Watch Free Demo',
    heroDemoUrl: '/demo',
    bottomCtaText: 'Start Learning Today',
    bottomCtaUrl: '/register',
    bottomSecondaryText: 'Explore Free Resources',
    bottomSecondaryUrl: '/resources',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/menus');
      const data = await res.json();

      if (data.success) {
        // Header
        const hItems = data.data.headerMenu?.items || [];
        setHeaderItems(
          hItems.map((item: any, idx: number) => ({
            id: item.id,
            label: item.label,
            url: item.url || '/',
            order: item.order ?? idx,
            target: item.target || '_self',
            isActive: item.isActive !== false,
          }))
        );

        // Footer
        const fItems = data.data.footerMenu?.items || [];
        const quick = fItems
          .filter((i: any) => i.target !== 'legal' && i.target !== '_legal')
          .map((item: any, idx: number) => ({
            id: item.id,
            label: item.label,
            url: item.url || '/',
            order: item.order ?? idx,
            target: '_self',
            isActive: item.isActive !== false,
          }));

        const legal = fItems
          .filter((i: any) => i.target === 'legal' || i.target === '_legal')
          .map((item: any, idx: number) => ({
            id: item.id,
            label: item.label,
            url: item.url || '/',
            order: item.order ?? idx,
            target: 'legal',
            isActive: item.isActive !== false,
            isLegal: true,
          }));

        setFooterQuickItems(quick);
        setFooterLegalItems(legal);

        if (data.data.settings) {
          setFooterSettings((prev) => ({ ...prev, ...data.data.settings }));
        }

        if (data.data.homepageLinks) {
          setHomepageLinks(data.data.homepageLinks);
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load menu configurations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Header Item Handlers
  const addHeaderItem = () => {
    setHeaderItems((prev) => [
      ...prev,
      { label: 'New Link', url: '/courses', order: prev.length, target: '_self', isActive: true },
    ]);
    setHasChanges(true);
  };

  const removeHeaderItem = (index: number) => {
    setHeaderItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateHeaderItem = (index: number, field: keyof MenuItemState, value: any) => {
    setHeaderItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setHasChanges(true);
  };

  const moveHeaderItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === headerItems.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...headerItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    setHeaderItems(newItems);
    setHasChanges(true);
  };

  // Footer Quick Item Handlers
  const addFooterQuickItem = () => {
    setFooterQuickItems((prev) => [
      ...prev,
      { label: 'New Link', url: '/about', order: prev.length, target: '_self', isActive: true },
    ]);
    setHasChanges(true);
  };

  const removeFooterQuickItem = (index: number) => {
    setFooterQuickItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateFooterQuickItem = (index: number, field: keyof MenuItemState, value: any) => {
    setFooterQuickItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setHasChanges(true);
  };

  // Footer Legal Item Handlers
  const addFooterLegalItem = () => {
    setFooterLegalItems((prev) => [
      ...prev,
      { label: 'New Policy', url: '/terms', order: prev.length, target: 'legal', isLegal: true, isActive: true },
    ]);
    setHasChanges(true);
  };

  const removeFooterLegalItem = (index: number) => {
    setFooterLegalItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateFooterLegalItem = (index: number, field: keyof MenuItemState, value: any) => {
    setFooterLegalItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = {
        headerItems,
        footerItems: [
          ...footerQuickItems.map((item, idx) => ({ ...item, order: idx, target: '_self' })),
          ...footerLegalItems.map((item, idx) => ({ ...item, order: idx + 20, target: 'legal' })),
        ],
        settings: footerSettings,
        homepageLinks,
      };

      const res = await fetch('/api/admin/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Saved Successfully! 🎉',
          description: 'Header, Footer, and Homepage links are now updated live.',
        });
        setHasChanges(false);
        fetchMenus();
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save menus',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (location: 'header' | 'footer') => {
    if (!confirm(`Reset ${location} links back to platform defaults?`)) return;

    try {
      setSaving(true);
      const res = await fetch('/api/admin/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetLocation: location }),
      });
      if (res.ok) {
        toast({ title: `${location === 'header' ? 'Header' : 'Footer'} reset to default links` });
        fetchMenus();
      }
    } catch {
      toast({ title: 'Reset failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                Menu & Navigation Links Manager
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Live Customizer
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Customize Header Navigation, Footer Quick & Legal Links, Contact Info, and Homepage CTA buttons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 animate-pulse">
                Unsaved changes
              </span>
            )}
            <Button
              onClick={handleSaveAll}
              loading={saving}
              variant="gradient"
              className="shadow-md shadow-brand-500/20"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save All Links
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b">
          <button
            onClick={() => setActiveTab('header')}
            className={cn(
              'px-5 py-3 font-heading font-bold text-sm border-b-2 transition-all flex items-center gap-2',
              activeTab === 'header'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <MenuIcon className="w-4 h-4" /> Header Navigation ({headerItems.length})
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={cn(
              'px-5 py-3 font-heading font-bold text-sm border-b-2 transition-all flex items-center gap-2',
              activeTab === 'footer'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <LinkIcon className="w-4 h-4" /> Footer Links & Info
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            className={cn(
              'px-5 py-3 font-heading font-bold text-sm border-b-2 transition-all flex items-center gap-2',
              activeTab === 'homepage'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Globe className="w-4 h-4" /> Homepage Action Buttons
          </button>
        </div>

        {/* TAB 1: HEADER MENU */}
        {activeTab === 'header' && (
          <div className="space-y-6">
            <div className="card p-6 border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Main Website Header Navigation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    These items appear on the desktop top header and the mobile hamburger menu drawer.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleReset('header')}
                    className="text-xs h-8"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    onClick={addHeaderItem}
                    className="text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add New Link
                  </Button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {headerItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border bg-card/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all hover:border-brand-300"
                  >
                    {/* Order Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveHeaderItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHeaderItem(index, 'down')}
                        disabled={index === headerItems.length - 1}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>

                    {/* Label Input */}
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Display Label</label>
                      <Input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateHeaderItem(index, 'label', e.target.value)}
                        placeholder="e.g. Courses"
                        className="h-9 text-sm"
                      />
                    </div>

                    {/* URL Input with Presets */}
                    <div className="flex-[1.5] space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Destination URL</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateHeaderItem(index, 'url', e.target.value)}
                          placeholder="/courses or https://"
                          className="h-9 text-sm font-mono flex-1"
                        />
                        <select
                          className="form-input text-xs h-9 w-28 text-muted-foreground"
                          onChange={(e) => {
                            if (e.target.value) {
                              updateHeaderItem(index, 'url', e.target.value);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Presets ▾
                          </option>
                          {COMMON_ROUTE_PRESETS.map((p) => (
                            <option key={p.url} value={p.url}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Target Selector */}
                    <div className="w-28 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Open In</label>
                      <select
                        className="form-input text-xs h-9 w-full"
                        value={item.target || '_self'}
                        onChange={(e) => updateHeaderItem(index, 'target', e.target.value)}
                      >
                        <option value="_self">Same Tab</option>
                        <option value="_blank">New Tab ↗</option>
                      </select>
                    </div>

                    {/* Delete button */}
                    <div className="pt-5 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => removeHeaderItem(index)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FOOTER LINKS & SETTINGS */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            {/* Quick Links Column */}
            <div className="card p-6 border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Footer Column 1: Quick Links
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Links displayed under the "Quick Links" column of the website footer.
                  </p>
                </div>
                <Button size="sm" variant="gradient" onClick={addFooterQuickItem} className="text-xs h-8">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Quick Link
                </Button>
              </div>

              <div className="space-y-3">
                {footerQuickItems.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-xl border bg-card flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-mono font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <Input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateFooterQuickItem(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="h-9 text-sm flex-1"
                    />
                    <Input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateFooterQuickItem(index, 'url', e.target.value)}
                      placeholder="/url"
                      className="h-9 text-sm font-mono flex-1"
                    />
                    <select
                      className="form-input text-xs h-9 w-28 text-muted-foreground hidden sm:block"
                      onChange={(e) => {
                        if (e.target.value) updateFooterQuickItem(index, 'url', e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Presets ▾</option>
                      {COMMON_ROUTE_PRESETS.map((p) => (
                        <option key={p.url} value={p.url}>{p.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFooterQuickItem(index)}
                      className="p-2 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Links Column */}
            <div className="card p-6 border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Footer Column 2: Legal & Policy Links
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Terms, Privacy Policy, Refund Policy, and FAQ links.
                  </p>
                </div>
                <Button size="sm" variant="gradient" onClick={addFooterLegalItem} className="text-xs h-8">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Legal Link
                </Button>
              </div>

              <div className="space-y-3">
                {footerLegalItems.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-xl border bg-card flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-mono font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <Input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateFooterLegalItem(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="h-9 text-sm flex-1"
                    />
                    <Input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateFooterLegalItem(index, 'url', e.target.value)}
                      placeholder="/url"
                      className="h-9 text-sm font-mono flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeFooterLegalItem(index)}
                      className="p-2 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Contact Details & Social Links */}
            <div className="card p-6 border space-y-5">
              <div className="pb-3 border-b">
                <h3 className="font-heading font-bold text-base text-foreground">
                  Footer Brand Info & Social Media Links
                </h3>
                <p className="text-xs text-muted-foreground">
                  About description, contact numbers, email, address, and social profiles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Footer About Text</label>
                  <textarea
                    rows={2}
                    className="form-input text-sm w-full resize-none"
                    value={footerSettings.footer_about || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, footer_about: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="Short description of your platform..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input
                    type="text"
                    value={footerSettings.phone || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, phone: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="+91 9934215013"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">WhatsApp Number</label>
                  <Input
                    type="text"
                    value={footerSettings.whatsapp || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, whatsapp: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="9934215013"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Support Email</label>
                  <Input
                    type="email"
                    value={footerSettings.contact_email || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, contact_email: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="support@cybermatesolutions.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Office Address</label>
                  <Input
                    type="text"
                    value={footerSettings.address || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, address: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="New Delhi, India"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Copyright Notice</label>
                  <Input
                    type="text"
                    value={footerSettings.copyright_text || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, copyright_text: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="© 2026 CyberMate Solutions. All rights reserved."
                  />
                </div>
              </div>

              {/* Social URLs */}
              <div className="pt-3 border-t space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-brand-600" /> Social Media Links (Optional)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Input
                    type="url"
                    placeholder="Facebook URL"
                    value={footerSettings.social_facebook || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, social_facebook: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="text-xs"
                  />
                  <Input
                    type="url"
                    placeholder="Instagram URL"
                    value={footerSettings.social_instagram || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, social_instagram: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="text-xs"
                  />
                  <Input
                    type="url"
                    placeholder="YouTube URL"
                    value={footerSettings.social_youtube || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, social_youtube: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="text-xs"
                  />
                  <Input
                    type="url"
                    placeholder="Twitter/X URL"
                    value={footerSettings.social_twitter || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, social_twitter: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="text-xs"
                  />
                  <Input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={footerSettings.social_linkedin || ''}
                    onChange={(e) => {
                      setFooterSettings((p) => ({ ...p, social_linkedin: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOMEPAGE CTAS */}
        {activeTab === 'homepage' && (
          <div className="space-y-6">
            <div className="card p-6 border space-y-6">
              <div className="pb-3 border-b">
                <h3 className="font-heading font-bold text-base text-foreground">
                  Homepage Action Buttons & Links
                </h3>
                <p className="text-xs text-muted-foreground">
                  Customize the buttons and navigation targets on your main landing page.
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-brand-600">
                  1. Top Hero Section Buttons
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Primary Button Label</label>
                    <Input
                      type="text"
                      value={homepageLinks.heroCtaText}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, heroCtaText: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Explore Courses"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Primary Button Target URL</label>
                    <Input
                      type="text"
                      value={homepageLinks.heroCtaUrl}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, heroCtaUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="/courses"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Demo Button Label</label>
                    <Input
                      type="text"
                      value={homepageLinks.heroDemoText}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, heroDemoText: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Watch Free Demo"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Demo Button Target URL</label>
                    <Input
                      type="text"
                      value={homepageLinks.heroDemoUrl}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, heroDemoUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="/demo"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom CTA Banner */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-purple-600">
                  2. Bottom CTA Banner Buttons
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Main Button Label</label>
                    <Input
                      type="text"
                      value={homepageLinks.bottomCtaText}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, bottomCtaText: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Start Learning Today"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Main Button URL</label>
                    <Input
                      type="text"
                      value={homepageLinks.bottomCtaUrl}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, bottomCtaUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="/register"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Secondary Button Label</label>
                    <Input
                      type="text"
                      value={homepageLinks.bottomSecondaryText}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, bottomSecondaryText: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Explore Free Resources"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Secondary Button URL</label>
                    <Input
                      type="text"
                      value={homepageLinks.bottomSecondaryUrl}
                      onChange={(e) => {
                        setHomepageLinks((p) => ({ ...p, bottomSecondaryUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="/resources"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="sticky bottom-4 z-20 bg-background/95 backdrop-blur-md p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold">Auto-Validation Active</p>
              <p className="text-[11px] text-muted-foreground">
                Click "Save All Links" to apply changes immediately across the entire website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveAll}
              loading={saving}
              variant="gradient"
              className="shadow-md shadow-brand-500/20"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save All Links
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
