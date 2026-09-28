'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  group: string;
  label: string | null;
}

const groupLabels: Record<string, string> = {
  general: 'General',
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
  const [changes, setChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const getValue = (setting: Setting): string => {
    return changes[setting.key] !== undefined ? changes[setting.key] : (setting.value || '');
  };

  const handleSave = async () => {
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
        toast({ title: 'Settings saved!', description: 'All changes have been saved' });
        setChanges({});
        fetchSettings();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    const group = setting.group || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">Site Settings</h1>
            <p className="text-sm text-muted-foreground">Manage website name, logo, contact details, social links and SEO</p>
          </div>
          <Button onClick={handleSave} loading={saving} variant="gradient">
            <Save className="h-4 w-4" /> Save All Changes
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
            <div key={group} className="card p-6">
              <h3 className="font-heading font-semibold mb-5 pb-3 border-b">
                {groupLabels[group] || group}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {groupSettings.map(setting => (
                  <div key={setting.key}>
                    <label className="form-label mb-1.5 block">{setting.label || setting.key}</label>
                    {setting.type === 'boolean' ? (
                      <select
                        className="form-input"
                        value={getValue(setting)}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      >
                        <option value="false">Disabled</option>
                        <option value="true">Enabled</option>
                      </select>
                    ) : setting.key.includes('url') || setting.key.includes('social') ? (
                      <Input
                        type="url"
                        placeholder="https://"
                        value={getValue(setting)}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        type="text"
                        value={getValue(setting)}
                        onChange={e => handleChange(setting.key, e.target.value)}
                      />
                    )}
                    {changes[setting.key] !== undefined && (
                      <p className="text-xs text-amber-600 mt-1">● Unsaved change</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
