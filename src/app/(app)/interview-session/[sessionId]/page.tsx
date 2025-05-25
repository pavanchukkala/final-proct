// File: src/app/(app)/interview-session/[sessionId]/page.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Properly import the RealtimeInterviewUI component
// Properly import the RealtimeInterviewUI component, handling named/default exports
const RealtimeInterviewUI = dynamic(
  async () => {
    const mod = await import('@/components/interview/realtime-interview-ui');
    const comp = (mod as any).default ?? (mod as any).RealtimeInterviewUI;
    if (!comp) {
      throw new Error('RealtimeInterviewUI component not found in module');
    }
    return comp;
  },
  { ssr: false, suspense: true }
);

// Placeholder API fetch - swap with real API
const fetchSessionData = async (sessionId: string): Promise<LiveInterviewSessionData> => {
  return {
    title: 'Live Interview Session',
    interviewerName: 'Recruiter Name',
    startTimestamp: Date.now(),
    durationMinutes: 0,
    questions: [
      { id: 'q1', prompt: 'Explain closure in JavaScript.' },
      { id: 'q2', prompt: 'Design an LRU cache.' },
    ],
  };
};

export default function LiveInterviewPage() {
  const { sessionId } = useParams();
  const sid = typeof sessionId === 'string' ? sessionId : 'default';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [session, setSession] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load session data
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSessionData(sid);
        setSession(data);
      } catch {
        setError('Unable to load session.');
      } finally {
        setLoading(false);
      }
    })();
  }, [sid]);

  // Start media capture
  const startProctoring = useCallback(async () => {
    setPermissionError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
    } catch (e: any) {
      console.error('getUserMedia error:', e);
      setPermissionError('Enable camera & mic in browser settings to continue.');
    }
  }, []);

  if (loading) return <Loader2 className="h-16 w-16 animate-spin m-auto mt-20" />;
  if (error || !session) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle />
        <AlertTitle>{error || 'Session not found'}</AlertTitle>
      </Alert>
    );
  }

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Join Live Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please enable your camera and microphone to start the live interview.</p>
            {permissionError && (
              <Alert variant="destructive">
                <AlertCircle /> {permissionError}
              </Alert>
            )}
            <Button onClick={startProctoring}>Enable Camera & Mic</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = session.questions;
  const total = questions.length;
  const current = questions[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">{session.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {session.interviewerName}</p>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-1/3 border-r p-4 space-y-4">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-64 bg-black rounded-lg" />
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <RealtimeInterviewUI interviewSession={session} question={current} mediaStream={stream} />
          </Suspense>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Question {currentIndex + 1} of {total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{current.prompt}</p>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}>Previous</Button>
            <Button disabled={currentIndex === total - 1} onClick={() => setCurrentIndex(i => Math.min(total - 1, i + 1))}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
