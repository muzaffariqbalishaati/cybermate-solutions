'use client';

import { useState, useEffect } from 'react';

export interface Branding {
  siteName: string;
  logoUrl: string | null;
  adminLogoUrl: string | null;
  faviconUrl: string | null;
  loading: boolean;
}

export function useBranding() {
  const [branding, setBranding] = useState<Branding>({
    siteName: 'CyberMate Solutions',
    logoUrl: null,
    adminLogoUrl: null,
    faviconUrl: null,
    loading: true,
  });

  const fetchBranding = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setBranding({
          siteName: data.data.site_name || 'CyberMate Solutions',
          logoUrl: data.data.logo_url || null,
          adminLogoUrl: data.data.admin_logo_url || null,
          faviconUrl: data.data.favicon_url || null,
          loading: false,
        });
      }
    } catch {
      setBranding(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchBranding();
    const handleUpdate = () => fetchBranding();
    window.addEventListener('site-settings-updated', handleUpdate);
    return () => window.removeEventListener('site-settings-updated', handleUpdate);
  }, []);

  return branding;
}
