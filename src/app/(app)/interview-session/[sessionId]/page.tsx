// src/app/(app)/interview-session/[sessionId]/page.tsx
"use client";

import { RealtimeInterviewUI } from '@/components/interview/realtime-interview-ui';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// -----------------------------------------------------------------------------
// Mock Live Interview Data - In a real app, this would be fetched from a backend
// The data includes multiple session types (Google, Netflix, and default fallback)
// -----------------------------------------------------------------------------
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': {
    id: '1',
    title: 'Google Frontend Engineer – Live Interview',
    interviewerName: 'Dr. Emily Carter',
    candidateName: 'Alex Johnson (You)',
    questions: [
      { id: 'live_q1_1', text: 'Welcome! Tell me about yourself and your journey into frontend development.', type: 'Discussion', prompt: 'Focus on key experiences and motivations.' },
      { id: 'live_q1_2', text: 'Can you explain the concept of the Virtual DOM in React and its benefits?', type: 'Discussion' },
      { id: 'live_q1_3', text: "Let's do a small coding exercise. Please write a JavaScript function to debounce another function. You can use the shared code editor.", type: 'Coding', language: 'javascript', prompt: 'Consider edge cases and explain your approach as you code.' },
      { id: 'live_q1_4', text: 'Describe a challenging technical problem you faced on a project and how you solved it.', type: 'Discussion' }
    ],
    durationMinutes: 45,
  },
  '4': {
    id: '4',
    title: 'Netflix UX Designer – Live Portfolio Review',
    interviewerName: 'Sarah Chen',
    candidateName: 'Jamie Lee (You)',
    questions: [
      { id: 'live_q4_1', text: 'Thanks for joining! Could you start by walking us through one of your key portfolio pieces that you are most proud of?', type: 'Discussion', prompt: 'Feel free to share your screen if needed to show your work.' },
      { id: 'live_q4_2', text: 'How do you typically incorporate user feedback into your design iterations?', type: 'Discussion' },
      { id: 'live_q4_3', text: 'What design tools are you most proficient with, and why do you prefer them?', type: 'Discussion' }
    ],
    durationMinutes: 30,
  },
  'default_live_interview': {
    id: 'default_live_interview',
    title: 'Standard Live Technical Screen',
    interviewerName: 'Interviewer AI',
    candidateName: 'Candidate X (You)',
    questions: [
      { id: 'dli_q1', text: 'What are your primary strengths as they relate to this role?', type: 'Discussion' },
      { id: 'dli_q2', text: 'Please write a simple function to reverse a string in the shared editor.', type: 'Coding', language: 'python' },
      { id: 'dli_q3', text: 'Do you have any questions for me about the role or the company?', type: 'Discussion' }
    ],
    durationMinutes: 20,
  }
};

// -----------------------------------------------------------------------------
// LiveInterviewPage Component
// Handles loading state, error state, and renders the RealtimeInterviewUI
// Includes mobile enhancements: smooth scrolling, safe-area, optimized performance
// -----------------------------------------------------------------------------
export default function LiveInterviewPage() {
  // Grab sessionId from dynamic route params
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';

  // Local state for interview data, loading, and error
  const [interviewSessionData, setInterviewSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to track if component is mounted to avoid state updates on unmounted
  const isMounted = useRef(true);

  // Fetch logic memoized to prevent re-creation between renders
  const fetchSession = useCallback(() => {
    setLoading(true);
    setError(null);

    // Simulate API fetch with timeout
    setTimeout(() => {
      if (!isMounted.current) return;
      const data = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions['default_live_interview'];
      if (data) {
        setInterviewSessionData(data);
      } else {
        setError('Live interview session not found. Please check the link or contact support.');
        setInterviewSessionData(null);
      }
      setLoading(false);
    }, 700);
  }, [sessionId]);

  // Effect to run fetch on mount & when sessionId changes
  useEffect(() => {
    fetchSession();
    return () => { isMounted.current = false; };
  }, [fetchSession]);

  // Shared container classes for mobile-friendly scrolling and safe-area
  const containerClasses = [
    'flex flex-col',
    'items-center justify-center',
    'w-full h-full',
    'px-4 md:px-8',
    'pt-safe-top pb-safe-bottom',
    'overflow-auto',
    'touch-action-pan-y',
    'overscroll-y-contain',
    'scroll-smooth',
    'will-change-transform',
    'bg-background'
  ].join(' ');

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className={containerClasses}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Preparing your live interview session...</p>
      </div>
    );
  }

  // Show error UI if fetch failed or no data
  if (error || !interviewSessionData) {
    return (
      <div className={containerClasses}>
        <Alert variant="destructive" className="max-w-lg w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Interview</AlertTitle>
          <AlertDescription>
            {error || "Could not load the interview session data. Please try again later or contact support."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render the real-time interview UI
  return (
    <div className={containerClasses}>
      {/* Pass interviewSessionData to UI without modification */}
      <RealtimeInterviewUI interviewSession={interviewSessionData} />
    </div>
  );
}


// src/app/(app)/interview-session/[sessionId]/layout.tsx
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Layout for live interview session: full screen container, hides global header/footer
// Ensures children fill viewport and handle overflow internally
// -----------------------------------------------------------------------------
export default function LiveInterviewSessionLayout({ children }: { children: ReactNode; }) {
  return (
    <main className="flex flex-col w-full h-screen overflow-hidden bg-background">
      {/* The header/footer are managed outside this layout */}
      <section className="flex-1 w-full overflow-auto overscroll-y-auto touch-action-pan-y scroll-smooth">
        {children}
      </section>
    </main>
  );
}
