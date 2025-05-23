// src/app/(app)/exam/[examId]/layout.tsx

import type { ReactNode } from 'react';

export default function ExamLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only wrap children—remove the header/footer that duplicates global layout
  return <>{children}</>;
}
