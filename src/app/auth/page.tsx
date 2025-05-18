// src/app/auth/page.tsx

'use client';

import Link from 'next/link';
import { AuthPanel } from '@/components/auth/auth-panel';
import { AppLogo } from '@/components/shared/app-logo';
import { User, Briefcase } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animated-gradient-background">
      <div className="absolute top-6 left-6">
        <AppLogo size="lg" />
      </div>
      <div className="w-full max-w-5xl space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-10 items-start">
        <Link href="/candidate/dashboard">
          <AuthPanel
            role="candidate"
            title="Candidate Portal"
            description="Apply for internships, take assessments, and track your progress."
            icon={User}
          />
        </Link>
        <Link href="/recruiter/dashboard">
          <AuthPanel
            role="recruiter"
            title="Recruiter Portal"
            description="Manage interviews, invite candidates, and analyze results."
            icon={Briefcase}
          />
        </Link>
      </div>
      <footer className="absolute bottom-6 text-center w-full">
        <p className="text-sm text-foreground/70">
          &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
