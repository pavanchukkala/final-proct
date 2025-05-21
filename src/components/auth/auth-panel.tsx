// src/app/auth/page.tsx

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthPanel } from '@/components/auth/auth-panel';
import { AppLogo } from '@/components/shared/app-logo';
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
};

type Role = keyof typeof roleConfig;

export default function AuthPage() {
  const [role, setRole] = useState<Role>('candidate');

  const { title, description, icon } = roleConfig[role];

  return (
    <AuthProvider>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animated-gradient-background">
        <div className="absolute top-6 left-6">
          <AppLogo size="lg" />
        </div>
        <div className="w-full max-w-xl mb-8">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <AuthPanel role={role} title={title} description={description} icon={icon} />
        <footer className="absolute bottom-6 text-center w-full">
          <p className="text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
