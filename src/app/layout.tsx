import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EduPro - Premium Online Tuition Platform',
    template: '%s | EduPro',
  },
  description: 'India\'s premier online tuition platform. Access live classes, recorded lectures, tests, and more from expert teachers.',
  keywords: ['online tuition', 'online education', 'live classes', 'courses', 'India'],
  authors: [{ name: 'EduPro Team' }],
  creator: 'EduPro',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'EduPro',
    title: 'EduPro - Premium Online Tuition Platform',
    description: 'India\'s premier online tuition platform for students.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduPro - Premium Online Tuition Platform',
    description: 'India\'s premier online tuition platform for students.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
