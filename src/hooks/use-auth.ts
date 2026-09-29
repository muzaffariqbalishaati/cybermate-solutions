'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | string;
  avatar?: string | null;
  phone?: string | null;
}

export function getRoleDashboardUrl(role?: string | null): string {
  if (!role) return '/student';
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'PARENT':
      return '/parent';
    case 'STUDENT':
    default:
      return '/student';
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const syncAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setUser(data.data);
        try {
          localStorage.setItem('auth_user', JSON.stringify(data.data));
        } catch {}
      } else {
        setUser(null);
        try {
          localStorage.removeItem('auth_user');
        } catch {}
      }
    } catch {
      // Keep cached user if offline or network hiccup
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // 1. Initial instant load from localStorage
    try {
      const cached = localStorage.getItem('auth_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.role || parsed.email)) {
          setUser(parsed);
          setIsLoading(false);
        }
      }
    } catch {}

    // 2. Validate current session with server
    syncAuth();

    // 3. Listen to auth changes
    const handleAuthChange = () => syncAuth();
    window.addEventListener('auth-state-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [syncAuth]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem('auth_user');
    } catch {}
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    router.push('/login');
  };

  const isLoggedIn = !!user;
  const dashboardUrl = getRoleDashboardUrl(user?.role);

  return {
    user,
    isLoggedIn,
    isLoading,
    mounted,
    dashboardUrl,
    logout,
    refreshAuth: syncAuth,
  };
}
