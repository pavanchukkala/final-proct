// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth'); // 🚀 Redirect to signup/login choice page
  }, [router]);

  return null;
}
