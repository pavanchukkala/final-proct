// src/app/auth/layout.tsx

// Disable static generation on this segment so it's always rendered on-demand
export const dynamic = 'force-dynamic';

'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
