// File: src/app/(app)/interview-session/[sessionId]/page.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LiveInterviewSessionData } from '@/types';

// Fetch session metadata (replace with real API)
const fetchSessionData = async (sessionId: string): Promise<LiveInterviewSessionData> => {
  // TODO: integrate your API
  return {
    title: 'Live Interview Session',
    interviewerName: 'Interviewer Name',
  };
};

export default function LiveInterviewPage() {
  const { sessionId } = useParams();
  const sid = typeof sessionId === 'string' ? sessionId : 'default';

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [session, setSession] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState<string>("// Type code here when prompted...\n");

  // Load session
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSessionData(sid);
        setSession(data);
      } catch {
        setError('Failed to load session.');
      } finally {
        setLoading(false);
      }
    })();
  }, [sid]);

  // Start media
  const startMedia = useCallback(async () => {
    setPermissionError(null);
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(ms);
      if (localRef.current) localRef.current.srcObject = ms;
      // TODO: Initialize WebRTC signaling to set remote feed on remoteRef
    } catch (e: any) {
      console.error(e);
      setPermissionError('Enable camera & microphone in browser settings.');
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

  if (!localStream) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Join Live Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The interviewer will ask questions over live video/audio. Enable camera & mic to join.</p>
            {permissionError && (
              <Alert variant="destructive"><AlertCircle /> {permissionError}</Alert>
            )}
            <Button onClick={startMedia}>Enable Camera & Mic</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">{session.title}</h1>
        <p className="text-sm text-muted-foreground">Interviewer: {session.interviewerName}</p>
      </header>

      {/* Main: video + code editor */}
      <div className="flex flex-1">
        <div className="w-1/3 border-r p-4 space-y-4">
          <video ref={remoteRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg" />
          <video ref={localRef} autoPlay muted playsInline className="w-1/3 h-32 bg-black rounded-lg absolute bottom-4 left-4 border-2 border-white" />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 border rounded p-2 bg-gray-50">
            {/* placeholder for code editor when needed */}
            <textarea
              className="w-full h-full p-2 font-mono text-sm"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Write code here when the interviewer asks you to solve a problem..."
            />
          </div>
          <Button className="mt-2 self-end" onClick={() => console.log('Submit code', code)}>
            Submit Code
          </Button>
        </div>
      </div>
    </div>
  );
}
