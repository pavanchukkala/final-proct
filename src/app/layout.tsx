// src/app/layout.tsx
'use client';                             // ← make this a client component
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { AppLogo } from '@/components/shared/app-logo';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/');

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* your global header */}
        <header className="sticky top-0 z-50 bg-white shadow">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <AppLogo size="md" />
            {/* … */}
          </div>
        </header>

        {/* conditionally apply the “container” wrapper only if NOT on auth routes */}
        <main
          className={
            isAuthRoute
              ? 'flex-1'                     // full bleed for auth
              : 'flex-1 container mx-auto px-4 sm:px-6 lg:px-8'  // normal pages
          }
        >
          {children}
        </main>

        {/* your global footer */}
        <footer className="bg-gray-100 py-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Proctoring System
        </footer>
      </body>
    </html>
  );
}
