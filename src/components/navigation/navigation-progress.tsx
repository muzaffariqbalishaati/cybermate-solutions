'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // Reset/Complete progress bar on navigation complete
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks and touchstart for 0ms instantaneous feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startProgress = () => {
      setVisible(true);
      setProgress(25);
      clearInterval(interval);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('javascript:') ||
        target.getAttribute('target') === '_blank'
      ) {
        return;
      }

      // Early prefetch on pointer/touch down for 0ms navigation
      try {
        if (href.startsWith('/')) {
          router.prefetch(href);
        }
      } catch {
        // Ignore prefetch error
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('javascript:') ||
        target.getAttribute('target') === '_blank'
      ) {
        return;
      }

      // Only trigger if internal navigation
      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        startProgress();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      clearInterval(interval);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none"
    >
      <div
        className="h-[3px] bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
