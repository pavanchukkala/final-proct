'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { AppLogo } from '@/components/shared/app-logo';
import { ShieldCheck, UserCircle } from 'lucide-react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo size="md" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Exam Mode</span>
            </div>

            {/* Profile Icon */}
            <div className="relative" ref={dropdownRef}>
              <UserCircle
                className="h-7 w-7 cursor-pointer text-primary hover:text-accent transition-colors"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-md z-50">
                  <button
                    onClick={() => console.log('Logout')}
                    className="block w-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="py-4 text-center border-t bg-card/95">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proctoring System. Best of luck!
        </p>
      </footer>
    </div>
  );
}
