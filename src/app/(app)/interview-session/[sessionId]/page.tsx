// src/app/(app)/interview-session/[sessionId]/page.tsx
"use client";

import { RealtimeInterviewUI } from '@/components/interview/realtime-interview-ui';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Mock Live Interview Data - In a real app, this would be fetched from a backend
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': { /* ... */ },
  '4': { /* ... */ },
  'default_live_interview': { /* ... */ }
};

export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';
  const [interviewSessionData, setInterviewSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch to prevent re-renders
  const fetchSession = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const data = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions['default_live_interview'];
      if (data) {
        setInterviewSessionData(data);
        setError(null);
      } else {
        setError('Live interview session not found. Please check the link or contact support.');
        setInterviewSessionData(null);
      }
      setLoading(false);
    }, 700);
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Container classes optimized for mobile smoothness and safe-area
  const containerClasses = [
    'flex flex-col',
    'items-center justify-center',
    'w-full h-full',
    'px-4',
    'pb-safe-bottom',
    'overflow-auto',
    'touch-action-pan-y',
    'overscroll-y-contain',
    'scroll-smooth',
    'will-change-transform'
  ].join(' ');

  if (loading) {
    return (
      <div className={containerClasses}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Preparing your live interview session...</p>
      </div>
    );
  }

  if (error || !interviewSessionData) {
    return (
      <div className={containerClasses}>
        <Alert variant="destructive" className="max-w-lg w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Interview</AlertTitle>
          <AlertDescription>
            {error || "Could not load the interview session data. Please try again later or contact support."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Real-time UI remains untouched */}
      <RealtimeInterviewUI interviewSession={interviewSessionData} />
    </div>
  );
}
