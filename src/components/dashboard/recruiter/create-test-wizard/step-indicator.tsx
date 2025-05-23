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
