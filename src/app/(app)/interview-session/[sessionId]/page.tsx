// File: src/app/(app)/interview-session/[sessionId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tooltip } from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';

// Dynamically import heavy real-time component
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  { ssr: false, loading: () => <Loader2 className="h-8 w-8 animate-spin text-primary" /> }
);

// -----------------------------------------------------------------------------
// Mock Live Interview Data - Replace with real API in production
// -----------------------------------------------------------------------------
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': {
    id: '1',
    title: 'Google Frontend Engineer – Live Interview',
    interviewerName: 'Dr. Emily Carter',
    candidateName: 'Alex Johnson (You)',
    questions: [
      { id: 'live_q1_1', text: 'Welcome! Tell me about yourself...', type: 'Discussion', prompt: 'Focus on key experiences.' },
      { id: 'live_q1_2', text: 'Explain Virtual DOM in React and benefits.', type: 'Discussion' },
      { id: 'live_q1_3', text: 'Write a debounce function in JS.', type: 'Coding', language: 'javascript', prompt: 'Consider edge cases.' },
      { id: 'live_q1_4', text: 'Describe a challenging problem and solution.', type: 'Discussion' }
    ],
    durationMinutes: 45,
  },
  '4': {
    id: '4',
    title: 'Netflix UX Designer – Live Portfolio Review',
    interviewerName: 'Sarah Chen',
    candidateName: 'Jamie Lee (You)',
    questions: [
      { id: 'live_q4_1', text: 'Walk through a key portfolio piece.', type: 'Discussion', prompt: 'Share your screen if needed.' },
      { id: 'live_q4_2', text: 'How do you incorporate user feedback?', type: 'Discussion' },
      { id: 'live_q4_3', text: 'Preferred design tools and why?', type: 'Discussion' }
    ],
    durationMinutes: 30,
  },
  'default_live_interview': {
    id: 'default_live_interview',
    title: 'Standard Live Technical Screen',
    interviewerName: 'Interviewer AI',
    candidateName: 'Candidate X (You)',
    questions: [
      { id: 'dli_q1', text: 'What are your primary strengths?', type: 'Discussion' },
      { id: 'dli_q2', text: 'Reverse a string in Python.', type: 'Coding', language: 'python' },
      { id: 'dli_q3', text: 'Any questions for me?', type: 'Discussion' }
    ],
    durationMinutes: 20,
  }
};

// -----------------------------------------------------------------------------
// Page Component
// Contains header, progress, theme toggle, and interview UI container
// -----------------------------------------------------------------------------
export default function LiveInterviewPage() {
  // Route param
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // Theme
  const { theme, setTheme } = useTheme();

  // State
  const [interviewSessionData, setInterviewSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const isMounted = useRef(true);

  // Fetch session data
  const fetchSession = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!isMounted.current) return;
      const data = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions['default_live_interview'];
      if (data) setInterviewSessionData(data);
      else setError('Session not found.');
      setLoading(false);
    }, 600);
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
    return () => { isMounted.current = false; };
  }, [fetchSession]);

  // Progress calculation
  const totalQuestions = interviewSessionData?.questions.length ?? 1;
  const progress = useMemo(
    () => ((currentQuestionIndex + 1) / totalQuestions) * 100,
    [currentQuestionIndex, totalQuestions]
  );

  // Handlers
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(i => i + 1);
  };
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(i => i - 1);
  };

  // Container classes
  const pageClasses = 'flex flex-col h-screen bg-background text-foreground select-none';
  const headerClasses = 'flex items-center justify-between p-4 border-b';
  const contentClasses = 'flex-1 flex flex-col overflow-auto p-4';
  const footerClasses = 'flex items-center justify-between p-4 border-t';

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !interviewSessionData) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Current question
  const question: TestQuestion = interviewSessionData.questions[currentQuestionIndex];

  return (
    <div className={pageClasses}>
      {/* Header */}
      <header className={headerClasses}>
        <div>
          <h1 className="text-xl font-semibold">{interviewSessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {interviewSessionData.interviewerName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip content="Toggle dark/light mode">
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
          <Button size="sm" variant="ghost" onClick={() => setCurrentQuestionIndex(0)}>
            Restart
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 pt-2">
        <Progress value={progress} className="h-2 rounded-full" aria-label="Question Progress" />
        <p className="text-xs text-muted-foreground mt-1">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </div>

      {/* Content: Animated question & real-time UI */}
      <main className={contentClasses}>
        <AnimatePresence exitBeforeEnter>
          <motion.section
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-medium">{question.text}</h2>
              {question.prompt && <p className="text-sm text-muted-foreground">{question.prompt}</p>}
            </div>
            {/* Real-time UI component for coding/discussion */}
            <div className="flex-1 border rounded-lg p-4 bg-card overflow-auto">
              <RealtimeInterviewUI interviewSession={interviewSessionData} question={question} />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
      <footer className={footerClasses}>
        <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="outline">
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
          Next
        </Button>
        <div className="text-sm text-muted-foreground">
          Time left: {interviewSessionData.durationMinutes - Math.floor((Date.now() % 3600000) / 60000)} min
        </div>
      </footer>
    </div>
  );
}
