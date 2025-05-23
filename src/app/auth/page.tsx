// src/app/auth/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import { AuthProvider } from '@/contexts/auth-context';
import { AuthPanel } from '@/components/auth/auth-panel';
import { AppLogo } from '@/components/shared/app-logo';
import { User, Briefcase } from 'lucide-react';

export default function AuthPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        {/* Logo at top */}
        <div className="mb-8">
          <AppLogo size="lg" />
        </div>

        {/* Two panels side by side on md+, stacked on sm */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <AuthPanel
            role="candidate"
            title="Candidate Portal"
            description="Apply for internships, take assessments, and track your progress."
            icon={User}
          />
          <AuthPanel
            role="recruiter"
            title="Recruiter Portal"
            description="Manage interviews, invite candidates, and analyze results."
            icon={Briefcase}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-foreground/70">
          &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
        </footer>
      </div>
    </AuthProvider>
  );
}
