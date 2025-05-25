// File: src/app/(app)/interview-session/[sessionId]/page.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';

// -----------------------------------------------------------------------------
// Custom Error Boundary
// -----------------------------------------------------------------------------
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle>Unable to load interview UI</AlertTitle>
            <AlertDescription>
              Please refresh the page or contact support if the issue persists.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

// Dynamically load the heavy real-time component (no SSR)
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  { ssr: false, suspense: true }
);

// -----------------------------------------------------------------------------
// Mock Interview Sessions (replace with real API calls in production)
// -----------------------------------------------------------------------------
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  default_live_interview: {
    title: 'Live Coding Interview',
    interviewerName: 'Jane Doe',
    startTimestamp: Date.now(),
    durationMinutes: 60,
    questions: [
      /* ... TestQuestion[] ... */
    ],
  },
  // other mock sessions
};

// -----------------------------------------------------------------------------
// LiveInterviewPage Component
// -----------------------------------------------------------------------------
export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // Session fetch state
  const [sessionData, setSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permission & media stream state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const isMounted = useRef(true);

  // Fetch session data (mocked)
  const fetchSession = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!isMounted.current) return;
      const data = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions['default_live_interview'];
      if (data) setSessionData(data);
      else setError('Interview session not found.');
      setLoading(false);
    }, 500);
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
    return () => { isMounted.current = false; };
  }, [fetchSession]);

  // Request camera/microphone on user gesture
  const startMediaStream = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
    } catch (err: any) {
      console.error('getUserMedia error:', err);
      if (err.name === 'NotAllowedError') {
        setPermissionError('Camera/microphone access was denied. Please enable permissions in your browser settings.');
      } else {
        setPermissionError('Unable to access camera/microphone.');
      }
    }
  };

  // Render loading or error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle>Error Loading Session</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // If media not started, prompt user
  if (!mediaStream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
        <p className="text-lg">Click below to enable your camera and microphone to start the interview.</p>
        {permissionError && <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>}
        <Button onClick={startMediaStream}>Enable Camera & Mic</Button>
      </div>
    );
  }

  // Interview UI once media is available
  const questions = sessionData.questions;
  const total = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = questions[currentIndex];
  const progressValue = useMemo(() => ((currentIndex + 1) / total) * 100, [currentIndex, total]);
  const elapsed = Math.floor((Date.now() - (sessionData.startTimestamp || Date.now())) / 60000);
  const timeLeft = sessionData.durationMinutes - elapsed;

  const nextQuestion = () => { if (currentIndex < total - 1) setCurrentIndex(i => i + 1); };
  const prevQuestion = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground select-none">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">{sessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {sessionData.interviewerName}</p>
        </div>
      </header>

      {/* Progress */}
      <section className="px-4 py-2">
        <Progress value={progressValue} className="h-2 rounded-full" />
        <p className="text-xs text-muted-foreground mt-1">
          Question {currentIndex + 1} of {total}
        </p>
      </section>

      {/* Live UI */}
      <main className="flex-1 overflow-auto p-4">
        <ErrorBoundary>
          <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary m-auto" />}>
            <RealtimeInterviewUI
              interviewSession={sessionData}
              question={current}
              mediaStream={mediaStream}
            />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between p-4 border-t">
        <Button onClick={prevQuestion} disabled={currentIndex === 0} variant="outline">Previous</Button>
        <div className="text-sm text-muted-foreground">
          Time left: {timeLeft > 0 ? `${timeLeft} min` : '00:00'}
        </div>
        <Button onClick={nextQuestion} disabled={currentIndex === total - 1}>Next</Button>
      </footer>
    </div>
  );
}
