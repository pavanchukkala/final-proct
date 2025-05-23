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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 px-4">
        <div className="relative w-full max-w-md">
          {/* Centered logo */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <AppLogo size="lg" />
          </div>

          {/* Panel container with padding to push it below logo */}
          <div className="pt-16 bg-background/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="px-6 py-8">
              {/* Role tabs */}
              <Tabs value={role} onValueChange={setRole} className="mb-6">
                <TabsList className="grid grid-cols-2 bg-muted/30 rounded-full p-1">
                  {(['candidate', 'recruiter'] as Role[]).map(r => (
                    <TabsTrigger
                      key={r}
                      value={r}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-inner"
                    >
                      {r === 'candidate' ? 'Candidate' : 'Recruiter'}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Auth form panel */}
              <AuthPanel
                role={role}
                title={title}
                description={description}
                icon={icon}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
          </footer>
        </div>
      </div>
    </AuthProvider>
  );
}
