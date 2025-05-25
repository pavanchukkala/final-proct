'use client';

import { usePathname } from 'next/navigation';
import { AppLogo } from '@/components/shared/app-logo';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const showLogo = !pathname.startsWith('/auth'); // Hide logo on /auth route

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {showLogo && <AppLogo size="md" />}
        </div>
      </header>

      <main className="flex-1 container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="py-4 text-center border-t bg-card/95">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proctoring System. Best of luck!
        </p>
      </footer>
    </div>
  );
};

export default Layout;
