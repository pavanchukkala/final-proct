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
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-md border border-border/30 rounded-2xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-primary/30">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-primary/15 rounded-full w-fit">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base px-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={isSignUp ? 'signup' : 'signin'}
            onValueChange={(value) => setIsSignUp(value === 'signup')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/40 rounded-md overflow-hidden">
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
    </div>
  );
}
