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

// Load real-time UI dynamically (no SSR)
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  { ssr: false, suspense: true }
);

// Mock data (replace with real API)
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  default_live_interview: {
    title: 'Live Coding Interview',
    interviewerName: 'Jane Doe',
    startTimestamp: Date.now(),
    durationMinutes: 60,
    questions: [], // Fill with TestQuestion[]
  },
};

export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // Mount state
  const isMounted = useRef(true);
  const [sessionData, setSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | null>(null);
  const [secureContext, setSecureContext] = useState<boolean>(true);

  // Fetch session mock
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

  // Check secure context and permissions
  useEffect(() => {
    setSecureContext(window.isSecureContext);
    navigator.permissions.query({ name: 'camera' as PermissionName }).then(cam => cam.onchange = () => setPermissionState(cam.state));
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then(mic => mic.onchange = () => setPermissionState(prev => prev));
    // initial state
    navigator.permissions.query({ name: 'camera' as PermissionName }).then(cam => setPermissionState(cam.state));
  }, []);

  // Request media on user gesture
  const startMediaStream = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      setPermissionState('granted');
    } catch (err: any) {
      console.error('getUserMedia error:', err);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        setPermissionError('Access denied. Enable camera and microphone in site settings.');
      } else {
        setPermissionError('Unable to access camera/microphone.');
      }
    }
  };

  // Loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  // Session error
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

  // Secure origin check
  if (!secureContext) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
        <Alert variant="destructive"><AlertCircle /> App must run on a secure origin (HTTPS).</Alert>
      </div>
    );
  }

  // Prompt for media if not yet granted
  if (permissionState !== 'granted' || !mediaStream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
        <p className="text-lg">Enable camera and microphone to start the interview.</p>
        {permissionError && <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>}
        <Button onClick={startMediaStream}>Enable Camera & Mic</Button>
      </div>
    );
  }

  // Interview UI
  const questions = sessionData.questions;
  const total = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = questions[currentIndex];
  const progressValue = useMemo(() => ((currentIndex + 1) / total) * 100, [currentIndex, total]);
  const elapsed = Math.floor((Date.now() - (sessionData.startTimestamp || Date.now())) / 60000);
  const timeLeft = sessionData.durationMinutes - elapsed;

  const nextQuestion = () => currentIndex < total - 1 && setCurrentIndex(i => i + 1);
  const prevQuestion = () => currentIndex > 0 && setCurrentIndex(i => i - 1);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground select-none">
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">{sessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {sessionData.interviewerName}</p>
        </div>
      </header>

      <section className="px-4 py-2">
        <Progress value={progressValue} className="h-2 rounded-full" />
        <p className="text-xs text-muted-foreground mt-1">Question {currentIndex + 1} of {total}</p>
      </section>

      <main className="flex-1 overflow-auto p-4">
        <ErrorBoundary>
          <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary m-auto" />}>
            <RealtimeInterviewUI interviewSession={sessionData} question={current} mediaStream={mediaStream} />
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="flex items-center justify-between p-4 border-t">
        <Button onClick={prevQuestion} disabled={currentIndex === 0} variant="outline">Previous</Button>
        <div className="text-sm text-muted-foreground">Time left: {timeLeft > 0 ? `${timeLeft} min` : '00:00'}</div>
        <Button onClick={nextQuestion} disabled={currentIndex === total - 1}>Next</Button>
      </footer>
    </div>
  );
}
