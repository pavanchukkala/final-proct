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

// Error boundary for UI failures
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

// Dynamic imports
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui').then(mod => mod.default),
  { ssr: false, suspense: true }
);
const CodeEditor = dynamic(
  () => import('@/components/code-editor'),
  { ssr: false }
);

// Fetch interview session metadata (replace with real API)
const fetchSessionData = async (sessionId: string): Promise<LiveInterviewSessionData> => {
  return {
    title: 'Live Interview Session',
    interviewerName: 'Interviewer Name',
    questions: [
      { id: 'q1', prompt: 'Implement a function to reverse a linked list.' },
      { id: 'q2', prompt: 'Design an LRU cache.' },
    ],
  };
};

export default function LiveInterviewPage() {
  const { sessionId } = useParams();
  const sid = typeof sessionId === 'string' ? sessionId : 'default';

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [session, setSession] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState<string>("// Write your solution here\n");

  // Load session metadata
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
  const startInterview = useCallback(async () => {
    setPermissionError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(media);
      if (localVideoRef.current) localVideoRef.current.srcObject = media;
    } catch (e: any) {
      console.error('getUserMedia error:', e);
      setPermissionError('Enable camera & mic in browser settings to continue.');
    }
  }, []);

  // Submit code handler
  const submitCode = () => {
    // send code to interviewer or judge
    console.log('Submitted code:', code);
  };

  if (loading) return <Loader2 className="h-16 w-16 animate-spin m-auto mt-20" />;
  if (error || !session) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle />
        <AlertTitle>{error || 'Session not found'}</AlertTitle>
      </Alert>
    );
  }

  // Pre-join prompt
  if (!localStream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Join Live Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please enable your camera & mic to join the live interview.</p>
            {permissionError && <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>}
            <Button onClick={startInterview}>Enable Camera & Mic</Button>
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
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">Proctoring System - {session.title}</h1>
        <p className="text-sm text-muted-foreground">Interviewer: {session.interviewerName}</p>
      </header>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Left: Video feeds */}
        <div className="w-1/4 border-r p-4 space-y-4 relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-48 bg-black rounded-lg" />
          <video ref={localVideoRef} autoPlay muted playsInline className="w-1/3 h-24 bg-black rounded-lg absolute bottom-4 left-4 border-2 border-white" />
        </div>

        {/* Center: Real-time UI and code editor */}
        <div className="w-1/2 border-r p-4 flex flex-col">
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <RealtimeInterviewUI localStream={localStream} />
          </Suspense>
          <div className="flex-1 mt-4">
            <CodeEditor value={code} onChange={setCode} language="typescript" />
          </div>
          <Button className="mt-2 self-end" onClick={submitCode}>Submit Code</Button>
        </div>

        {/* Right: Question panel */}
        <div className="w-1/4 p-6 space-y-6 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Question {currentIndex + 1} of {total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{current.prompt}</p>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>Previous</Button>
            <Button disabled={currentIndex === total - 1} onClick={() => setCurrentIndex(i => i + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
