// src/app/layout.tsx
import type { ReactNode } from 'react';
import { AppLogo } from '@/components/shared/app-logo';
import { ShieldCheck } from 'lucide-react';

export default function ExamLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 w-[99%] mx-auto">
          <AppLogo size="md" />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span>Secure Exam Mode</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-[99%] mx-auto container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="py-4 text-center border-t bg-card/95 w-[97.5%] mx-auto">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proctoring System. Best of luck!
        </p>
      </footer>
    </div>
  );
}
