// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * A clean, professional horizontal step indicator.
 */
export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="relative flex items-center justify-between w-full">
        {/* Connector line */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full h-px bg-border" />
        </div>

        {steps.map((stepName, idx) => {
          const status =
            idx < currentStep
              ? 'completed'
              : idx === currentStep
              ? 'current'
              : 'upcoming';

          const markerClasses = {
            completed: 'bg-primary border-primary',
            current: 'bg-white border-primary',
            upcoming: 'bg-background border-border',
          };

          const labelClasses = {
            completed: 'text-primary font-medium',
            current: 'text-primary font-semibold',
            upcoming: 'text-muted-foreground font-medium',
          };

          return (
            <li
              key={stepName}
              className="relative flex flex-col items-center flex-1"
            >
              {/* Marker */}
              <div
                className={
                  `relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ` +
                  markerClasses[status]
                }
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : status === 'current' ? (
                  <div className="h-4 w-4 rounded-full bg-primary" />
                ) : null}
              </div>

              {/* Label */}
              <p className={`mt-2 text-center text-sm ${labelClasses[status]}`}>{stepName}</p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// src/components/dashboard/recruiter/create-test-wizard/candidate-preview.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CandidatePreview() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Candidate Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Test Title</h3>
            <p className="text-base font-medium">Frontend Developer Screening</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Duration</h3>
            <p className="text-base font-medium">60 minutes</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Total Questions</h3>
            <p className="text-base font-medium">15 questions</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Sections</h3>
            <ul className="list-disc list-inside text-base font-medium">
              <li>MCQs - 10 Questions</li>
              <li>Code Output - 3 Questions</li>
              <li>Paragraph Writing - 2 Questions</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Candidates will have to complete the test in one go. No pause or revisit.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline">Edit</Button>
            <Button variant="default">Publish Test</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
