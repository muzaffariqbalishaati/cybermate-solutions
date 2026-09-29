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
  HardDrive,
  Folder,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Key,
  Copy,
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
  payment: 'Payment Gateway & Razorpay Config',
  general: 'General Settings',
  contact: 'Contact Information',
  social: 'Social Media Links',
  seo: 'SEO & Metadata',
  footer: 'Footer Settings',
  header: 'Header Settings',
  storage: 'Google Drive & Cloud Storage',
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

  const [testingRazorpay, setTestingRazorpay] = useState(false);

  // Google Drive state
  const [testingDrive, setTestingDrive] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [showJsonBox, setShowJsonBox] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [driveStatus, setDriveStatus] = useState<{
    connected?: boolean;
    folderName?: string;
    folderId?: string;
    email?: string;
    error?: string;
  } | null>(null);

  const handleTestRazorpay = async () => {
    setTestingRazorpay(true);
    try {
      const res = await fetch('/api/admin/payments/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyId: getValue('razorpay_key_id'),
          keySecret: getValue('razorpay_key_secret'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Razorpay Connected! 💳',
          description: `Verified in ${data.data.mode} mode. Webhook secret configured: ${data.data.webhookConfigured ? 'Yes' : 'No'}`,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: data.error || 'Check Razorpay credentials',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to test connection',
        variant: 'destructive',
      });
    } finally {
      setTestingRazorpay(false);
    }
  };

  const handleTestDrive = async () => {
    setTestingDrive(true);
    setDriveStatus(null);
    try {
      const res = await fetch('/api/admin/drive/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: getValue('gdrive_client_email'),
          privateKey: getValue('gdrive_private_key'),
          folderId: getValue('gdrive_folder_id'),
          serviceAccountJson: getValue('gdrive_service_account_json'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDriveStatus({
          connected: true,
          folderName: data.data.folderName,
          folderId: data.data.folderId,
          email: data.data.email,
        });
        toast({
          title: 'Google Drive Connected! 🚀',
          description: `Connected to "${data.data.folderName}". Files and notes will automatically upload here!`,
        });
      } else {
        setDriveStatus({
          connected: false,
          error: data.error || 'Failed to connect to Google Drive',
        });
        toast({
          title: 'Google Drive Connection Failed',
          description: data.error || 'Please check service account credentials and folder permissions.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      setDriveStatus({ connected: false, error: err.message });
      toast({
        title: 'Drive Test Error',
        description: err.message || 'Failed to test connection',
        variant: 'destructive',
      });
    } finally {
      setTestingDrive(false);
    }
  };

  const handleAutoParseJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.client_email) {
        handleChange('gdrive_client_email', parsed.client_email);
      }
      if (parsed.private_key) {
        handleChange('gdrive_private_key', parsed.private_key);
      }
      handleChange('gdrive_service_account_json', jsonString);
      toast({
        title: 'Credentials Extracted! ✅',
        description: `Service account: ${parsed.client_email}`,
      });
    } catch {
      toast({
        title: 'Invalid JSON',
        description: 'Please paste the entire valid Google Cloud Service Account JSON file content.',
        variant: 'destructive',
      });
    }
  };

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

  // Group settings other than branding and google drive (which has its own dedicated card)
  const brandingKeys = ['site_name', 'logo_url', 'admin_logo_url', 'favicon_url'];
  const storageKeys = [
    'gdrive_enabled',
    'gdrive_folder_id',
    'gdrive_client_email',
    'gdrive_private_key',
    'gdrive_service_account_json',
    'gdrive_public_link',
  ];
  
  const groupedSettings = settings
    .filter(s => !brandingKeys.includes(s.key) && !storageKeys.includes(s.key))
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
        {/* SECTION 2: GOOGLE DRIVE CLOUD STORAGE INTEGRATION */}
        {/* ======================================================== */}
        <div className="card p-6 border-2 border-brand-500/20 bg-gradient-to-br from-white via-brand-50/20 to-sky-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                <svg className="w-8 h-8" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                    Google Drive Cloud Storage
                  </h2>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      getValue('gdrive_enabled') === 'true'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {getValue('gdrive_enabled') === 'true' ? '🟢 Cloud Storage Active' : '⚪ Disabled (Local Storage)'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Website par upload hone wali sabhi files (PDF notes, logos, study material) Google Drive folder mein store hongi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestDrive}
                loading={testingDrive}
                className="bg-white dark:bg-slate-800 border-brand-300 text-brand-700 hover:bg-brand-50 text-xs font-semibold"
              >
                <HardDrive className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Test & Verify Connection
              </Button>
            </div>
          </div>

          {/* Test Status Banner */}
          {driveStatus && (
            <div
              className={cn(
                'p-4 rounded-xl text-xs flex items-start gap-3 border transition-all animate-fadeIn',
                driveStatus.connected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 border-red-300 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300'
              )}
            >
              {driveStatus.connected ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <p className="font-bold">
                  {driveStatus.connected ? 'Google Drive Connected Successfully!' : 'Connection Failed'}
                </p>
                {driveStatus.connected ? (
                  <p>
                    Target Folder: <span className="font-semibold underline">{driveStatus.folderName}</span> | Service Account: <span className="font-mono">{driveStatus.email}</span>
                  </p>
                ) : (
                  <p>{driveStatus.error}</p>
                )}
              </div>
            </div>
          )}

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Storage Toggle */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Google Drive Storage Enable Karein</span>
                <span className="font-mono text-[10px] text-muted-foreground">gdrive_enabled</span>
              </label>
              <select
                className="form-input text-sm font-semibold text-slate-800 dark:text-slate-100"
                value={getValue('gdrive_enabled', 'false')}
                onChange={e => handleChange('gdrive_enabled', e.target.value)}
              >
                <option value="false">⚪ Disabled (Store on Server / Local)</option>
                <option value="true">🟢 Enabled (Automatically Upload all Files to Google Drive)</option>
              </select>
              <p className="text-[11px] text-muted-foreground">
                Jab yeh ON hoga, to sabhi files direct Google Drive mein upload hokar shareable link banengi.
              </p>
            </div>

            {/* Folder ID */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Google Drive Target Folder ID
                </label>
                {getValue('gdrive_folder_id') && (
                  <a
                    href={`https://drive.google.com/drive/folders/${getValue('gdrive_folder_id')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                  >
                    Open Drive Folder <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <Input
                type="text"
                placeholder="e.g. 1a2B3c4D5e6F7g8H9i0J..."
                value={getValue('gdrive_folder_id', '')}
                onChange={e => handleChange('gdrive_folder_id', e.target.value)}
                className="text-sm font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Google Drive folder open karke URL se folder ID copy karein (drive.google.com/drive/folders/<b>[FOLDER_ID]</b>)
              </p>
            </div>

            {/* Service Account Email */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Google Service Account Client Email</span>
                <span className="font-mono text-[10px] text-muted-foreground">gdrive_client_email</span>
              </label>
              <Input
                type="email"
                placeholder="e.g. my-drive-bot@project-id.iam.gserviceaccount.com"
                value={getValue('gdrive_client_email', '')}
                onChange={e => handleChange('gdrive_client_email', e.target.value)}
                className="text-sm font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                ⚠️ Is email ko apne Google Drive folder par jakar <b>"Editor"</b> access zaroor dein!
              </p>
            </div>

            {/* Service Account Private Key */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Google Service Account Private Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> {showPrivateKey ? 'Hide' : 'Show Key'}
                </button>
              </div>
              {showPrivateKey ? (
                <textarea
                  rows={2}
                  className="form-input text-xs font-mono resize-none"
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                  value={getValue('gdrive_private_key', '')}
                  onChange={e => handleChange('gdrive_private_key', e.target.value)}
                />
              ) : (
                <Input
                  type="password"
                  placeholder="-----BEGIN PRIVATE KEY----- ... (Hidden)"
                  value={getValue('gdrive_private_key', '')}
                  onChange={e => handleChange('gdrive_private_key', e.target.value)}
                  className="text-sm font-mono"
                />
              )}
              <p className="text-[11px] text-muted-foreground">
                Service Account key downloaded from Google Cloud IAM.
              </p>
            </div>
          </div>

          {/* Quick Paste JSON Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold">Quick Setup: Paste Google Cloud Service Account JSON</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonBox(!showJsonBox)}
                className="text-xs h-7 text-brand-600"
              >
                {showJsonBox ? 'Close JSON Box' : 'Open JSON Box'}
              </Button>
            </div>

            {showJsonBox && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={4}
                  className="form-input text-xs font-mono w-full"
                  placeholder='Paste full downloaded JSON here: { "type": "service_account", "project_id": "...", "private_key": "...", "client_email": "..." }'
                  value={rawJsonInput}
                  onChange={e => setRawJsonInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="gradient"
                    onClick={() => {
                      if (!rawJsonInput.trim()) {
                        toast({ title: 'Please paste JSON content first', variant: 'destructive' });
                        return;
                      }
                      handleAutoParseJson(rawJsonInput);
                    }}
                    className="text-xs"
                  >
                    Auto-Extract Credentials
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Instructions */}
          <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Google Drive Link Karne Ka Simple Tarika:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Google Cloud Console mein jakar <b>Google Drive API</b> enable karein aur ek <b>Service Account</b> banayein.</li>
              <li>Google Drive mein ek Folder banayein (jaise: <i>CyberMate Platform Uploads</i>).</li>
              <li>Folder par Right Click &rarr; Share karein aur Service Account ke <b>Client Email</b> ko <b>Editor</b> role dein.</li>
              <li>Folder ka ID aur Service Account Key yahan daal kar <b>"Test & Verify Connection"</b> par click karein.</li>
            </ol>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: OTHER SITE SETTINGS (PAYMENT, SEO, ETC.) */}
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
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-semibold text-foreground text-base">
                    {groupLabels[group] || group}
                  </h3>
                  {group === 'payment' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestRazorpay}
                      loading={testingRazorpay}
                      className="text-xs h-7 px-2.5 bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Verify Razorpay Setup
                    </Button>
                  )}
                </div>
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
                    ) : setting.key === 'razorpay_mode' ? (
                      <select
                        className="form-input text-sm font-semibold text-slate-800"
                        value={getValue(setting.key, setting.value || 'test')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      >
                        <option value="test">🟡 Test Mode (Sandbox)</option>
                        <option value="live">🟢 Live Mode (Real Transactions)</option>
                      </select>
                    ) : setting.type === 'password' || setting.key.includes('secret') ? (
                      <Input
                        type="password"
                        placeholder="Enter secret key..."
                        value={getValue(setting.key, setting.value || '')}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        className="text-sm font-mono"
                      />
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
