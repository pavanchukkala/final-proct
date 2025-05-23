// File: src/app/(app)/interview-session/[sessionId]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { RealtimeInterviewUI } from "@/components/interview/realtime-interview-ui";
import type { LiveInterviewSessionData, TestQuestion } from "@/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  // ... (your original 3 sessions here)
};

export default function LiveInterviewPage() {
  const { sessionId: rawId } = useParams() ?? {};
  const sessionId = typeof rawId === "string" ? rawId : "default_live_interview";

  const [data, setData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (!isMounted.current) return;
      const fetched = mockLiveInterviewSessions[sessionId] ?? mockLiveInterviewSessions.default_live_interview;
      if (fetched) {
        setData(fetched);
        setError(null);
      } else {
        setError("Session not found. Please check the link.");
      }
      setLoading(false);
    }, 700);

    return () => {
      isMounted.current = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background px-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="sr-only">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Responsive container: full-width on mobile, centered max‐width on md+
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{data.title}</h1>
          <p className="text-sm text-muted-foreground">Interviewer: {data.interviewerName}</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto px-4 py-3">
        <div className="max-w-3xl mx-auto space-y-6">
          {data.questions.map((q: TestQuestion, idx) => (
            <div
              key={q.id}
              className={`p-4 border rounded-lg bg-card ${
                idx === 0 ? "" : "mt-4"
              }`}
            >
              <h2 className="text-lg font-medium">{q.text}</h2>
              {q.prompt && <p className="mt-1 text-sm text-muted-foreground">{q.prompt}</p>}
              <div className="mt-3">
                <RealtimeInterviewUI interviewSession={data} question={q} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-4 py-3 border-t text-center text-xs text-muted-foreground">
        Duration: {data.durationMinutes} min &nbsp;|&nbsp; Candidate: {data.candidateName}
      </footer>
    </div>
  );
}
