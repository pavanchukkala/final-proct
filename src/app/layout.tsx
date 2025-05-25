'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { AppLogo } from '@/components/shared/app-logo';
import { ShieldCheck, UserCircle } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    // Implement actual logout logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo size="md" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Exam Mode</span>
            </div>

            {/* Profile Icon */}
            <div className="relative" ref={dropdownRef}>
              <UserCircle
                className="h-7 w-7 text-primary cursor-pointer hover:text-accent transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white border z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
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
}
