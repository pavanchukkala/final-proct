// src/app/(app)/interview-session/[sessionId]/layout.tsx

import type { ReactNode } from 'react';

export default function LiveInterviewSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only render the session UI—no extra header/footer
  return <>{children}</>;
}
