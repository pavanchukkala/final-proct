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
};

type Role = keyof typeof roleConfig;

export default function AuthPage() {
  const [role, setRole] = useState<Role>('candidate');

  const { title, description, icon } = roleConfig[role];

  return (
    <AuthProvider>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
        <div className="absolute top-6 left-6">
          <AppLogo size="lg" />
        </div>

        <div className="w-full max-w-xl bg-background/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <Tabs value={role} onValueChange={setRole} className="mb-8">
            <TabsList className="grid grid-cols-2 bg-muted/30 rounded-full p-1">
              <TabsTrigger value="candidate" className="data-[state=active]:bg-background">
                Candidate
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="data-[state=active]:bg-background">
                Recruiter
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 flex justify-center">
              <AuthPanel role={role} title={title} description={description} icon={icon} />
            </div>
          </Tabs>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
