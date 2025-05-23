// src/app/(app)/interview-session/[sessionId]/layout.tsx

import type { ReactNode } from 'react';

export default function LiveInterviewSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Render only the session-specific UI without duplicating the global header/footer
  return <>{children}</>;
}
