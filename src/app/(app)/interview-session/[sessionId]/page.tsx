"use client";

import Head from 'next/head';
import { RealtimeInterviewUI } from '@/components/interview/realtime-interview-ui';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock Live Interview Data - In a real app, this would be fetched from a backend
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': { /* …same as before… */ },
  '4': { /* …same as before… */ },
  'default_live_interview': { /* …same as before… */ },
};

export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string'
    ? params.sessionId
    : 'default_live_interview';
  const [interviewSessionData, setInterviewSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetched =
        mockLiveInterviewSessions[sessionId] ||
        mockLiveInterviewSessions['default_live_interview'];
      if (fetched) {
        setInterviewSessionData(fetched);
        setError(null);
      } else {
        setError('Live interview session not found. Please check the link or contact support.');
        setInterviewSessionData(null);
      }
      setLoading(false);
    }, 700);
  }, [sessionId]);

  // Ensure viewport meta for proper mobile scaling
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-center text-base sm:text-lg text-muted-foreground">
            Preparing your live interview session...
          </p>
        </div>
      )}

      {!loading && (error || !interviewSessionData) && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-red-50">
          <Alert variant="destructive" className="max-w-md w-full">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
              <div className="ml-3">
                <AlertTitle className="text-red-800 text-lg">Error Loading Interview</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error ?? "Could not load the interview session data. Please try again later or contact support."}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {!loading && interviewSessionData && (
        // Full-height container with auto scrolling
        <div className="h-screen flex flex-col">
          <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
            {/* Inner wrapper ensures any wide content scrolls */}
            <div className="min-w-full">
              <RealtimeInterviewUI interviewSession={interviewSessionData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
