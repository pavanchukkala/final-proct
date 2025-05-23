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

// Dynamically import the heavy real-time UI component (coding editor, chat, etc.)
const RealtimeInterviewUI = dynamic(
  () => import('@/components/interview/realtime-interview-ui'),
  {
    ssr: false,
    loading: () => <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading interview UI" />
  }
);

// -----------------------------------------------------------------------------
// Mock Data for Live Interview Sessions
// In production, replace this with an API call fetching session data by sessionId.
// -----------------------------------------------------------------------------
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': {
    id: '1',
    title: 'Google Frontend Engineer – Live Interview',
    interviewerName: 'Dr. Emily Carter',
    candidateName: 'Alex Johnson (You)',
    durationMinutes: 45,
    questions: [
      {
        id: 'live_q1_1',
        text: 'Welcome! Tell me about yourself and your journey into frontend development.',
        type: 'Discussion',
        prompt: 'Focus on key experiences and motivations.'
      },
      {
        id: 'live_q1_2',
        text: 'Can you explain the concept of the Virtual DOM in React and its benefits?',
        type: 'Discussion'
      },
      {
        id: 'live_q1_3',
        text: 'Write a debounce function in JavaScript. Consider edge cases and explain your approach.',
        type: 'Coding',
        language: 'javascript'
      },
      {
        id: 'live_q1_4',
        text: 'Describe a challenging technical problem you faced on a project and how you solved it.',
        type: 'Discussion'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Netflix UX Designer – Live Portfolio Review',
    interviewerName: 'Sarah Chen',
    candidateName: 'Jamie Lee (You)',
    durationMinutes: 30,
    questions: [
      {
        id: 'live_q4_1',
        text: 'Could you start by walking us through one of your key portfolio pieces?',
        type: 'Discussion',
        prompt: 'Feel free to share your screen if needed.'
      },
      {
        id: 'live_q4_2',
        text: 'How do you incorporate user feedback into your design iterations?',
        type: 'Discussion'
      },
      {
        id: 'live_q4_3',
        text: 'What design tools are you most proficient with, and why do you prefer them?',
        type: 'Discussion'
      }
    ]
  },
  'default_live_interview': {
    id: 'default_live_interview',
    title: 'Standard Live Technical Screen',
    interviewerName: 'Interviewer AI',
    candidateName: 'Candidate X (You)',
    durationMinutes: 20,
    questions: [
      {
        id: 'dli_q1',
        text: 'What are your primary strengths as they relate to this role?',
        type: 'Discussion'
      },
      {
        id: 'dli_q2',
        text: 'Please write a function to reverse a string in Python.',
        type: 'Coding',
        language: 'python'
      },
      {
        id: 'dli_q3',
        text: 'Do you have any questions for me about the role or the company?',
        type: 'Discussion'
      }
    ]
  }
};

// -----------------------------------------------------------------------------
// LiveInterviewPage Component
// Renders header, progress, question panel animations, and controls
// ----------------------------------------------------------------------------
export default function LiveInterviewPage() {
  // === Route Parameter ===
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // === Theme Toggle ===
  const { theme, setTheme } = useTheme();

  // === Local State ===
  const [sessionData, setSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMounted = useRef(true);

  // Fetch the session data (mocked)
  const loadSession = useCallback(() => {
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
    loadSession();
    return () => {
      isMounted.current = false;
    };
  }, [loadSession]);

  // If still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If error
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

  // Prepare question data
  const questions = sessionData.questions;
  const total = questions.length;
  const current = questions[currentIndex];
  const progressValue = useMemo(() => ((currentIndex + 1) / total) * 100, [currentIndex, total]);

  // Navigation handlers
  const handleNext = () => { if (currentIndex < total - 1) setCurrentIndex(i => i + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };

  // Calculate time left (simple countdown from duration)
  const elapsedMinutes = Math.floor(((Date.now() - (sessionData.startTimestamp || Date.now())) / 60000));
  const timeLeft = sessionData.durationMinutes - elapsedMinutes;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground select-none">
      {/* Header Section */}
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">{sessionData.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {sessionData.interviewerName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tooltip content="Dark/Light Mode">
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
          <Button size="sm" variant="ghost" onClick={() => setCurrentIndex(0)}>
            Restart
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <section className="px-4 py-2">
        <Progress value={progressValue} className="h-2 rounded-full" aria-label="Interview Progress" />
        <p className="text-xs text-muted-foreground mt-1">
          Question {currentIndex + 1} of {total}
        </p>
      </section>

      {/* Animated Question & UI Container */}
      <main className="flex-1 overflow-auto p-4">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={current.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-medium">{current.text}</h2>
              {current.prompt && <p className="text-sm text-muted-foreground">{current.prompt}</p>}
            </div>
            <div className="border rounded-lg p-4 bg-card h-96 overflow-auto">
              <RealtimeInterviewUI interviewSession={sessionData} question={current} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="flex items-center justify-between p-4 border-t">
        <Button onClick={handlePrev} disabled={currentIndex === 0} variant="outline">
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Time left: {timeLeft > 0 ? `${timeLeft} min` : '00:00'}
        </div>
        <Button onClick={handleNext} disabled={currentIndex === total - 1}>
          Next
        </Button>
      </footer>
    </div>
  );
}
