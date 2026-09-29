import { PublicHeader } from '@/components/layouts/public-header';
import { PublicFooter } from '@/components/layouts/public-footer';
import { MobileBottomNav } from '@/components/navigation/mobile-bottom-nav';
import prisma from '@/lib/prisma';

let cachedLayoutData: {
  headerMenu: any;
  footerMenu: any;
  settingsMap: Record<string, string | null>;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function getLayoutData() {
  const now = Date.now();
  if (cachedLayoutData && now - cachedLayoutData.timestamp < CACHE_TTL_MS) {
    return cachedLayoutData;
  }

  try {
    const [headerMenu, footerMenu, settings] = await Promise.all([
      prisma.menu.findUnique({
        where: { location: 'header' },
        include: {
          items: {
            where: { parentId: null, isActive: true },
            orderBy: { order: 'asc' },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      }),
      prisma.menu.findUnique({
        where: { location: 'footer' },
        include: {
          items: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      }),
      prisma.siteSetting.findMany(),
    ]);

    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

    const data = { headerMenu, footerMenu, settingsMap, timestamp: now };
    cachedLayoutData = data;
    return data;
  } catch {
    if (cachedLayoutData) return cachedLayoutData;
    return {
      headerMenu: null,
      footerMenu: null,
      settingsMap: { site_name: 'CyberMate Solutions' },
      timestamp: now,
    };
  }
}

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { headerMenu, footerMenu, settingsMap } = await getLayoutData();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand-500 selection:text-white">
      <PublicHeader menu={headerMenu} settings={settingsMap} />
      {/* Mobile bottom nav safe padding pb-16 md:pb-0 */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <PublicFooter menu={footerMenu} settings={settingsMap} />
      <MobileBottomNav />
    </div>
  );
}
