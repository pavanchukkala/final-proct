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

// Error boundary for UI errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error); }
  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle />
          <AlertTitle>UI failed to load</AlertTitle>
          <AlertDescription>Refresh or contact support.</AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Lazy-load the Realtime UI
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  { ssr: false, suspense: true }
);

// Mock session data (replace in production)
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  default_live_interview: {
    title: 'Live Coding Interview',
    interviewerName: 'Jane Doe',
    startTimestamp: Date.now(),
    durationMinutes: 60,
    questions: [],
  },
};

export default function LiveInterviewPage() {
  // URL params
  const { sessionId: sid } = useParams();
  const sessionId = typeof sid === 'string' ? sid : 'default_live_interview';

  // Refs
  const isMounted = useRef(true);

  // Session state
  const [sessionData, setSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media & permissions
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraState, setCameraState] = useState<PermissionState>('prompt');
  const [micState, setMicState] = useState<PermissionState>('prompt');
  const [secure, setSecure] = useState<boolean>(true);

  // Interview navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  // Derived values (must be after state declarations)
  const questions = sessionData?.questions || [];
  const total = questions.length;
  const progress = useMemo(() => total > 0 ? ((currentIndex + 1) / total) * 100 : 0, [currentIndex, total]);
  const elapsedMin = sessionData ? Math.floor((Date.now() - sessionData.startTimestamp) / 60000) : 0;
  const timeLeft = sessionData ? sessionData.durationMinutes - elapsedMin : 0;

  // Fetch mock session
  const fetchSession = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!isMounted.current) return;
      const data = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions.default_live_interview;
      if (data) setSessionData(data);
      else setError('Session not found');
      setLoading(false);
    }, 300);
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
    return () => { isMounted.current = false; };
  }, [fetchSession]);

  // Check secure context & permission initial states
  useEffect(() => {
    setSecure(window.isSecureContext);
    navigator.permissions.query({ name: 'camera' }).then(res => {
      setCameraState(res.state);
      res.onchange = () => setCameraState(res.state);
    });
    navigator.permissions.query({ name: 'microphone' }).then(res => {
      setMicState(res.state);
      res.onchange = () => setMicState(res.state);
    });
  }, []);

  // Handler to start media
  const startMedia = async () => {
    if (cameraState === 'denied' || micState === 'denied') {
      setPermissionError('Permissions denied. Re-enable camera & mic in browser settings.');
      return;
    }
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
    } catch (err: any) {
      console.error('getUserMedia error:', err);
      setPermissionError(err.name === 'NotAllowedError'
        ? 'Access denied. Enable camera & microphone in browser settings.'
        : 'Error accessing camera/microphone.');
    }
  };

  // Early returns & rendering
  if (loading) {
    return <Loader2 className="h-16 w-16 animate-spin m-auto mt-20" />;
  }

  if (error || !sessionData) {
    return <Alert variant="destructive"><AlertCircle />{error || 'Unknown error'}</Alert>;
  }

  if (!secure) {
    return <Alert variant="destructive"><AlertCircle />App requires HTTPS to access camera/mic.</Alert>;
  }

  if (cameraState === 'denied' || micState === 'denied') {
    return (
      <div className="p-4">
        <Alert variant="destructive"><AlertCircle />Permissions permanently denied. Update browser/site settings.</Alert>
      </div>
    );
  }

  if (!mediaStream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">Enable camera & microphone to proceed.</p>
        {permissionError && <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>}
        <Button onClick={startMedia}>Enable Camera & Mic</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 flex justify-between border-b">
        <div>
          <h1 className="text-2xl font-bold">{sessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {sessionData.interviewerName}</p>
        </div>
        <div className="text-sm">Time left: {timeLeft > 0 ? `${timeLeft} min` : '00:00'}</div>
      </header>

      <Progress value={progress} className="h-2 rounded-full m-4" />
      <main className="flex-1 p-4 overflow-auto">
        <ErrorBoundary>
          <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin m-auto" />}>
            <RealtimeInterviewUI
              interviewSession={sessionData}
              question={questions[currentIndex]}
              mediaStream={mediaStream}
            />
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="p-4 flex justify-between border-t">
        <Button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          variant="outline"
        >Prev</Button>
        <span className="text-sm">{currentIndex + 1} / {total}</span>
        <Button
          onClick={() => setCurrentIndex(i => Math.min(total - 1, i + 1))}
          disabled={currentIndex === total - 1}
        >Next</Button>
      </footer>
    </div>
  );
}
