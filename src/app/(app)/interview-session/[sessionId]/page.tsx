// File: src/app/(app)/interview-session/[sessionId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';

// Dynamically load the heavy real-time component
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  {
    ssr: false,
    loading: () => <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading interview UI" />
  }
);

// -----------------------------------------------------------------------------
// Mock Interview Sessions
// In production, replace this mock with API integration
// -----------------------------------------------------------------------------
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': {
    id: '1',
    title: 'Google Frontend Engineer – Live Interview',
    interviewerName: 'Dr. Emily Carter',
    candidateName: 'Alex Johnson (You)',
    durationMinutes: 45,
    questions: [
      { id: 'live_q1_1', text: 'Welcome! Tell me about yourself and your journey into frontend development.', type: 'Discussion', prompt: 'Focus on key experiences and motivations.' },
      { id: 'live_q1_2', text: 'Can you explain the concept of the Virtual DOM in React and its benefits?', type: 'Discussion' },
      { id: 'live_q1_3', text: 'Write a debounce function in JavaScript. Consider edge cases and explain your approach.', type: 'Coding', language: 'javascript' },
      { id: 'live_q1_4', text: 'Describe a challenging technical problem you faced on a project and how you solved it.', type: 'Discussion' }
    ]
  },
  '4': {
    id: '4',
    title: 'Netflix UX Designer – Live Portfolio Review',
    interviewerName: 'Sarah Chen',
    candidateName: 'Jamie Lee (You)',
    durationMinutes: 30,
    questions: [
      { id: 'live_q4_1', text: 'Could you start by walking us through one of your key portfolio pieces?', type: 'Discussion', prompt: 'Feel free to share your screen if needed.' },
      { id: 'live_q4_2', text: 'How do you incorporate user feedback into your design iterations?', type: 'Discussion' },
      { id: 'live_q4_3', text: 'What design tools are you most proficient with, and why do you prefer them?', type: 'Discussion' }
    ]
  },
  'default_live_interview': {
    id: 'default_live_interview',
    title: 'Standard Live Technical Screen',
    interviewerName: 'Interviewer AI',
    candidateName: 'Candidate X (You)',
    durationMinutes: 20,
    questions: [
      { id: 'dli_q1', text: 'What are your primary strengths as they relate to this role?', type: 'Discussion' },
      { id: 'dli_q2', text: 'Please write a function to reverse a string in Python.', type: 'Coding', language: 'python' },
      { id: 'dli_q3', text: 'Do you have any questions for me about the role or the company?', type: 'Discussion' }
    ]
  }
};

// -----------------------------------------------------------------------------
// LiveInterviewPage Component
// Clean, dependency-light version without external animation or theme libs
// -----------------------------------------------------------------------------
export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // Local state
  const [sessionData, setSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMounted = useRef(true);

  // Fetch session (mock)
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
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

  // Derived values
  const questions = sessionData.questions;
  const total = questions.length;
  const current = questions[currentIndex];
  const progressValue = useMemo(() => ((currentIndex + 1) / total) * 100, [currentIndex, total]);

  // Navigation handlers
  const nextQuestion = () => { if (currentIndex < total - 1) setCurrentIndex(i => i + 1); };
  const prevQuestion = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };

  // Timer (simple)
  const elapsed = Math.floor((Date.now() - (sessionData.startTimestamp || Date.now())) / 60000);
  const timeLeft = sessionData.durationMinutes - elapsed;

  // Styling classes
  const pageClasses = 'flex flex-col h-screen bg-background text-foreground select-none';
  const headerClasses = 'flex items-center justify-between p-4 border-b';
  const progressSection = 'px-4 py-2';
  const contentClasses = 'flex-1 overflow-auto p-4';
  const footerClasses = 'flex items-center justify-between p-4 border-t';

  return (
    <div className={pageClasses}>
      {/* Header */}
      <header className={headerClasses}>
        <div>
          <h1 className="text-2xl font-bold">{sessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {sessionData.interviewerName}</p>
        </div>
      </header>

      {/* Progress */}
      <section className={progressSection}>
        <Progress value={progressValue} className="h-2 rounded-full" aria-label="Interview Progress" />
        <p className="text-xs text-muted-foreground mt-1">Question {currentIndex + 1} of {total}</p>
      </section>

      {/* Question & UI */}
      <main className={contentClasses}>
        <div className="space-y-6 transition-all ease-in-out duration-300">
          <div>
            <h2 className="text-xl font-medium">{current.text}</h2>
            {current.prompt && <p className="text-sm text-muted-foreground">{current.prompt}</p>}
          </div>
          <div className="border rounded-lg p-4 bg-card h-96 overflow-auto">
            <RealtimeInterviewUI interviewSession={sessionData} question={current} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={footerClasses}>
        <div className="flex items-center space-x-2">
          <Button onClick={prevQuestion} disabled={currentIndex === 0} variant="outline">Previous</Button>
          <Button onClick={nextQuestion} disabled={currentIndex === total - 1}>Next</Button>
        </div>
        <div className="text-sm text-muted-foreground">Time left: {timeLeft > 0 ? `${timeLeft} min` : '00:00'}</div>
      </footer>
    </div>
  );
}
