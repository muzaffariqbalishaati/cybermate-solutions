'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react';

export function FooterAccountLink() {
  const { user, isLoggedIn, dashboardUrl, mounted, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (mounted && isLoggedIn) {
    const profileUrl = user?.role === 'ADMIN'
      ? '/admin/settings'
      : `${dashboardUrl}/profile`;

    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors font-semibold focus:outline-none"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name || 'User'} className="h-5 w-5 rounded-full object-cover" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'My Account'}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-sm">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
              <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider text-brand-400">{user?.role}</p>
            </div>

            {/* Dashboard */}
            <Link
              href={dashboardUrl}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-brand-400" />
              <span>Dashboard</span>
            </Link>

            {/* Profile */}
            <Link
              href={profileUrl}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-slate-700 my-1" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/login" className="hover:text-slate-300 transition-colors">
      Student Login
    </Link>
  );
}
