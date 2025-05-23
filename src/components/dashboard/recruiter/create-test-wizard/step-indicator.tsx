// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * A sleek, modern step indicator with improved UI for production readiness.
 */
export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="relative flex items-center justify-between w-full px-2 sm:px-4 lg:px-6">
        {/* Connector line */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full h-0.5 bg-border" />
        </div>

        {steps.map((stepName, idx) => {
          const status =
            idx < currentStep
              ? 'completed'
              : idx === currentStep
              ? 'current'
              : 'upcoming';

          const markerClasses = {
            completed: 'bg-primary border-primary text-white',
            current: 'bg-background border-primary text-primary shadow-md',
            upcoming: 'bg-background border-border text-muted-foreground hover:border-muted',
          };

          const labelClasses = {
            completed: 'text-primary font-medium',
            current: 'text-primary font-semibold',
            upcoming: 'text-muted-foreground font-medium',
          };

          return (
            <li
              key={stepName}
              className="relative flex flex-col items-center flex-1 group"
            >
              {/* Marker */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${markerClasses[status]}`}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : status === 'current' ? (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                ) : null}
              </div>

              {/* Label */}
              <p className={`mt-3 text-center text-xs sm:text-sm ${labelClasses[status]}`}>{stepName}</p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
