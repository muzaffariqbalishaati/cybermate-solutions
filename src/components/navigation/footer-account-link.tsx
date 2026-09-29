'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export function FooterAccountLink() {
  const { isLoggedIn, dashboardUrl, mounted } = useAuth();

  if (mounted && isLoggedIn) {
    return (
      <Link href={dashboardUrl} className="hover:text-slate-200 transition-colors font-semibold text-brand-400">
        My Dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className="hover:text-slate-300 transition-colors">
      Student Login
    </Link>
  );
}
