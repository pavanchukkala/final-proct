// src/components/auth/auth-panel.tsx

'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AuthForm } from './auth-form';
import type { UserRole } from '@/contexts/auth-context';

interface AuthPanelProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
}

export function AuthPanel({ role, title, description, icon: Icon }: AuthPanelProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl">
      <CardHeader className="text-center pt-6 pb-2 space-y-2">
        <div className="mx-auto p-3 bg-primary/20 rounded-full w-fit">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground px-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <Tabs
          value={isSignUp ? 'signup' : 'signin'}
          onValueChange={(value) => setIsSignUp(value === 'signup')}
        >
          <TabsList className="grid grid-cols-2 mb-4 bg-muted/30 rounded-md">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <AuthForm
              role={role}
              isSignUp={false}
              onToggleMode={() => setIsSignUp(true)}
            />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm
              role={role}
              isSignUp={true}
              onToggleMode={() => setIsSignUp(false)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
