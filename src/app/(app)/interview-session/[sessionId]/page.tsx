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
import type { LiveInterviewSessionData } from '@/types';

// Error boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error); }
  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle />
          <AlertTitle>UI Error</AlertTitle>
          <AlertDescription>Something went wrong. Please refresh.</AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Dynamic real-time interview logic (WebRTC signaling, proctoring)
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui').then(mod => mod.default),
  { ssr: false, suspense: true }
);

// Simple code editor fallback
const CodeEditor: React.FC<{value: string; onChange: (v: string) => void;}> = ({ value, onChange }) => (
  <textarea
    className="w-full h-full p-2 border rounded resize-none font-mono"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

// Fetch session metadata
const fetchSessionData = async (sessionId: string): Promise<LiveInterviewSessionData> => {
  return {
    title: 'Live Interview Session',
    interviewerName: 'Interviewer Name',
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
  const [code, setCode] = useState<string>("// Write and run code when asked by the interviewer\n");

  // Load session metadata
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSessionData(sid);
        setSession(data);
      } catch {
        setError('Unable to load session metadata.');
      } finally {
        setLoading(false);
      }
    })();
  }, [sid]);

  // Start audio/video
  const startInterview = useCallback(async () => {
    setPermissionError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(media);
      if (localVideoRef.current) localVideoRef.current.srcObject = media;
    } catch (e: any) {
      console.error('getUserMedia error:', e);
      setPermissionError('Please enable camera & mic in browser settings.');
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

  // Prompt user to join
  if (!localStream) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 space-y-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Join Live Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The interviewer will ask questions live over video/audio. Enable camera & mic to proceed.</p>
            {permissionError && <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>}
            <Button onClick={startInterview}>Enable Camera & Mic</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">{session.title}</h1>
        <p className="text-sm text-muted-foreground">Interviewer: {session.interviewerName}</p>
      </header>

      {/* Content: video + signaling UI + code editor when needed */}
      <div className="flex flex-1">
        {/* Video feeds */}
        <div className="w-1/3 border-r p-4 space-y-4 relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg" />
          <video ref={localVideoRef} autoPlay muted playsInline className="w-1/3 h-32 bg-black rounded-lg absolute bottom-4 left-4 border-2 border-white" />
        </div>

        {/* Proctoring and signaling logic */}
        <div className="flex-1 p-4">
          <ErrorBoundary>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
              <RealtimeInterviewUI
                localStream={localStream}
                onRemoteStream={stream => {
                  if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
                }}
              />
            </Suspense>
          </ErrorBoundary>

          {/* Code editor slot: only use if asked */}
          <div className="mt-6 h-1/3">
            <CodeEditor value={code} onChange={setCode} />
            <Button className="mt-2" onClick={() => console.log('Code submitted', code)}>Submit Code</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
