'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  Globe,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/cn';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  group: string;
  label: string | null;
}

const groupLabels: Record<string, string> = {
  general: 'General Settings',
  contact: 'Contact Information',
  social: 'Social Media Links',
  seo: 'SEO & Metadata',
  footer: 'Footer Settings',
  header: 'Header Settings',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, string>>({});
  
  // Preview mode toggle for website logo (light/dark bg)
  const [previewBgDark, setPreviewBgDark] = useState(false);

  // File input refs
  const websiteLogoInputRef = useRef<HTMLInputElement>(null);
  const adminLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const getValue = (key: string, defaultValue = ''): string => {
    if (changes[key] !== undefined) return changes[key];
    const item = settings.find(s => s.key === key);
    return item?.value || defaultValue;
  };

  // Handle direct file upload to /api/admin/upload
  const handleFileUpload = async (file: File, targetKey: 'logo_url' | 'admin_logo_url' | 'favicon_url') => {
    // Validate file type
    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file (PNG, JPG, SVG, WebP, GIF, ICO)',
        variant: 'destructive',
      });
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image file size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingTarget(targetKey);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetKey', targetKey);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      const uploadedUrl = data.data.url;

      // Update local state and remove from pending changes
      handleChange(targetKey, uploadedUrl);
      
      // Update settings array in-place
      setSettings(prev =>
        prev.map(s => (s.key === targetKey ? { ...s, value: uploadedUrl } : s))
      );

      // Trigger global event so AdminLayout updates immediately
      window.dispatchEvent(new Event('site-settings-updated'));

      toast({
        title: 'Logo Updated!',
        description: `${targetKey === 'logo_url' ? 'Website Logo' : targetKey === 'admin_logo_url' ? 'Admin Logo' : 'Favicon'} has been uploaded and applied successfully!`,
      });
    } catch (err: any) {
      toast({
        title: 'Upload Failed',
        description: err.message || 'Error uploading file',
        variant: 'destructive',
      });
    } finally {
      setUploadingTarget(null);
    }
  };

  // Handle removing logo
  const handleRemoveLogo = async (targetKey: 'logo_url' | 'admin_logo_url' | 'favicon_url') => {
    handleChange(targetKey, '');
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: [{ key: targetKey, value: '' }] }),
      });
      
      setSettings(prev =>
        prev.map(s => (s.key === targetKey ? { ...s, value: '' } : s))
      );
      
      window.dispatchEvent(new Event('site-settings-updated'));
      toast({ title: 'Logo Removed', description: 'Reverted to default branding icon' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove logo', variant: 'destructive' });
    }
  };

  const handleSaveAll = async () => {
    if (Object.keys(changes).length === 0) {
      toast({ title: 'No changes to save' });
      return;
    }

    setSaving(true);
    try {
      const settingsArray = Object.entries(changes).map(([key, value]) => ({ key, value }));
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (res.ok) {
        toast({ title: 'Settings saved!', description: 'All changes have been successfully saved.' });
        setChanges({});
        await fetchSettings();
        window.dispatchEvent(new Event('site-settings-updated'));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const siteName = getValue('site_name', 'CyberMate Solutions');
  const websiteLogo = getValue('logo_url', '');
  const adminLogo = getValue('admin_logo_url', '');
  const faviconUrl = getValue('favicon_url', '/favicon.ico');

  // Group settings other than branding (which is featured at the top)
  const brandingKeys = ['site_name', 'logo_url', 'admin_logo_url', 'favicon_url'];
  
  const groupedSettings = settings
    .filter(s => !brandingKeys.includes(s.key))
    .reduce((acc, setting) => {
      const group = setting.group || 'general';
      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    }, {} as Record<string, Setting[]>);

  const unsavedCount = Object.keys(changes).length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">Site & Brand Settings</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Live Customizer
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Upload custom logos for your website and admin panel, configure site identity, and manage platform details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unsavedCount > 0 && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 animate-pulse">
                {unsavedCount} unsaved {unsavedCount === 1 ? 'change' : 'changes'}
              </span>
            )}
            <Button
              onClick={handleSaveAll}
              loading={saving}
              variant="gradient"
              className="shadow-md shadow-brand-500/20"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save All Changes
            </Button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: LOGO & BRAND IDENTITY (MAIN FOCUS OF USER) */}
        {/* ======================================================== */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-500" />
                Logo & Brand Customization (Picture Upload)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload image files (PNG, JPG, SVG, WebP) directly from your device. Changes take effect across the entire website and admin panel.
              </p>
            </div>
          </div>

          {/* Site Name Field */}
          <div className="bg-muted/40 p-4 rounded-xl border space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Website / Brand Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="e.g. CyberMate Solutions"
                value={siteName}
                onChange={e => handleChange('site_name', e.target.value)}
                className="font-medium text-base bg-background"
              />
              <span className="text-xs text-muted-foreground self-center shrink-0">
                Displayed in browser tab, navbar brand, and footer
              </span>
            </div>
          </div>

          {/* Two Logo Cards: Website Logo vs Admin Panel Logo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Website Public Logo */}
            <div className="flex flex-col justify-between p-5 rounded-xl border bg-background/50 hover:border-brand-300 transition-all space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground">Website Main Logo</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                    key: logo_url
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Visible on public navigation header, footer, registration, and student portal.
                </p>

                {/* Logo Preview Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Live Preview</span>
                    <button
                      type="button"
                      onClick={() => setPreviewBgDark(!previewBgDark)}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      {previewBgDark ? (
                        <>
                          <Sun className="h-3 w-3" /> Light Preview
                        </>
                      ) : (
                        <>
                          <Moon className="h-3 w-3" /> Dark Preview
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className={cn(
                      'h-28 rounded-xl border border-dashed flex items-center justify-center p-4 transition-colors relative overflow-hidden',
                      previewBgDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
                    )}
                  >
                    {websiteLogo ? (
                      <div className="relative group max-h-full flex items-center justify-center">
                        <img
                          src={websiteLogo}
                          alt="Website Logo Preview"
                          className="h-14 max-h-14 w-auto max-w-[240px] object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 opacity-80">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="font-heading font-extrabold text-xl">{siteName}</span>
                        <span className="text-[10px] text-muted-foreground border px-1.5 py-0.5 rounded ml-1">
                          Default
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload & Actions */}
              <div className="space-y-3 pt-2 border-t">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={websiteLogoInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'logo_url');
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="flex-1"
                    loading={uploadingTarget === 'logo_url'}
                    onClick={() => websiteLogoInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload Website Logo
                  </Button>

                  {websiteLogo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveLogo('logo_url')}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Optional URL input */}
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Or paste Image URL / Base64 Data:
                  </label>
                  <Input
                    type="text"
                    placeholder="https://... or data:image/..."
                    value={websiteLogo}
                    onChange={e => handleChange('logo_url', e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            {/* 2. Admin Panel Logo */}
            <div className="flex flex-col justify-between p-5 rounded-xl border bg-background/50 hover:border-brand-300 transition-all space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground">Admin Panel Logo</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                    key: admin_logo_url
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Visible in the top-left sidebar of the Admin Panel (defaults to website logo if empty).
                </p>

                {/* Logo Preview Box (Dark sidebar match) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Admin Sidebar Preview (Dark Theme)</span>
                  </div>

                  <div className="h-28 rounded-xl border border-dashed border-slate-700 bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
                    {adminLogo || websiteLogo ? (
                      <div className="flex items-center gap-2.5 max-h-full">
                        <img
                          src={adminLogo || websiteLogo}
                          alt="Admin Logo Preview"
                          className="h-10 max-h-10 w-auto max-w-[140px] object-contain rounded"
                        />
                        <div>
                          <div className="text-white font-bold text-xs truncate max-w-[120px]">{siteName}</div>
                          <div className="text-[10px] text-slate-400">Admin Panel</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs">{siteName}</div>
                          <div className="text-[10px] text-slate-400">Admin Panel</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload & Actions */}
              <div className="space-y-3 pt-2 border-t">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={adminLogoInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'admin_logo_url');
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    loading={uploadingTarget === 'admin_logo_url'}
                    onClick={() => adminLogoInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload Admin Logo
                  </Button>

                  {adminLogo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveLogo('admin_logo_url')}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* Optional URL input */}
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Or paste Image URL / Base64 Data:
                  </label>
                  <Input
                    type="text"
                    placeholder="Leave empty to use main website logo"
                    value={adminLogo}
                    onChange={e => handleChange('admin_logo_url', e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Favicon Uploader */}
          <div className="p-4 rounded-xl border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="Favicon" className="h-6 w-6 object-contain" />
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm">Browser Favicon</h4>
                <p className="text-xs text-muted-foreground">
                  The small icon displayed in the browser tab (recommended: 32x32 or 64x64 PNG or ICO).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="file"
                ref={faviconInputRef}
                accept="image/x-icon,image/png,image/svg+xml,image/vnd.microsoft.icon"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'favicon_url');
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={uploadingTarget === 'favicon_url'}
                onClick={() => faviconInputRef.current?.click()}
                className="text-xs"
              >
                <Upload className="h-3 w-3 mr-1" /> Change Favicon
              </Button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: OTHER SITE SETTINGS (CONTACT, SEO, ETC.) */}
        {/* ======================================================== */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-5 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="skeleton h-10 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(groupedSettings).map(([group, groupSettings]) => (
            <div key={group} className="card p-6 space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground text-base">
                  {groupLabels[group] || group}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {groupSettings.length} {groupSettings.length === 1 ? 'field' : 'fields'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {groupSettings.map(setting => (
                  <div key={setting.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground">
                        {setting.label || setting.key}
                      </label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {setting.key}
                      </span>
                    </div>

                    {setting.type === 'boolean' ? (
                      <select
                        className="form-input text-sm"
                        value={getValue(setting.key, setting.value || '')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      >
                        <option value="false">Disabled / Off</option>
                        <option value="true">Enabled / On</option>
                      </select>
                    ) : setting.key.includes('url') || setting.key.includes('social') ? (
                      <Input
                        type="url"
                        placeholder="https://"
                        value={getValue(setting.key, setting.value || '')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        className="text-sm"
                      />
                    ) : setting.key === 'footer_about' || setting.key === 'default_meta_desc' ? (
                      <textarea
                        rows={2}
                        className="form-input text-sm resize-none"
                        value={getValue(setting.key, setting.value || '')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        type="text"
                        value={getValue(setting.key, setting.value || '')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        className="text-sm"
                      />
                    )}

                    {changes[setting.key] !== undefined && (
                      <p className="text-[11px] text-amber-600 font-medium">● Unsaved change</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Bottom Save Bar */}
        <div className="sticky bottom-4 z-20 bg-background/95 backdrop-blur-md p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold">Auto-Sync Enabled</p>
              <p className="text-[11px] text-muted-foreground">
                Picture uploads update immediately. Text edits apply on Save.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unsavedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChanges({})}
                disabled={saving}
              >
                Discard Changes
              </Button>
            )}
            <Button
              onClick={handleSaveAll}
              loading={saving}
              variant="gradient"
              className="shadow-md shadow-brand-500/20"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
