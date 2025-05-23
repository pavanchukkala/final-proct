// src/app/auth/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { AuthPanel } from '@/components/auth/auth-panel';
import { AppLogo } from '@/components/shared/app-logo';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase } from 'lucide-react';

const roleConfig = {
  candidate: {
    title: 'Candidate Portal',
    description: 'Apply for internships, take assessments, and track your progress.',
    icon: User,
  },
  recruiter: {
    title: 'Recruiter Portal',
    description: 'Manage interviews, invite candidates, and analyze results.',
    icon: Briefcase,
  },
} as const;
type Role = keyof typeof roleConfig;

export default function AuthPage() {
  const [role, setRole] = useState<Role>('candidate');
  const { title, description, icon } = roleConfig[role];

  return (
    <AuthProvider>
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gradient-to-br from-primary/10 to-secondary/10
          px-4
        "
      >
        {/* Centered Column */}
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AppLogo size="lg" />
          </div>

          {/* Role Tabs */}
          <Tabs value={role} onValueChange={setRole} className="mb-6">
            <TabsList className="grid grid-cols-2 gap-1 bg-muted/20 rounded-md p-1">
              <TabsTrigger
                value="candidate"
                className="data-[state=active]:bg-background data-[state=active]:shadow"
              >
                Candidate
              </TabsTrigger>
              <TabsTrigger
                value="recruiter"
                className="data-[state=active]:bg-background data-[state=active]:shadow"
              >
                Recruiter
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Your existing panel, untouched */}
          <AuthPanel
            role={role}
            title={title}
            description={description}
            icon={icon}
          />

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
          </footer>
        </div>
      </div>
    </AuthProvider>
  );
}
