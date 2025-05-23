// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * A sleek, professional horizontal step indicator with better spacing and clarity.
 */
export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="relative flex items-center justify-between w-full px-2 sm:px-6">
        {/* Connector Line */}
        <div className="absolute inset-0 flex items-center justify-between" aria-hidden="true">
          <div className="w-full h-1 bg-muted rounded-full" />
        </div>

        {steps.map((stepName, idx) => {
          const status =
            idx < currentStep
              ? 'completed'
              : idx === currentStep
              ? 'current'
              : 'upcoming';

          const markerClasses = {
            completed: 'bg-primary border-primary text-white shadow-sm',
            current: 'bg-background border-4 border-primary shadow-md',
            upcoming: 'bg-background border-2 border-border text-muted-foreground',
          };

          const labelClasses = {
            completed: 'text-primary font-semibold',
            current: 'text-primary font-bold',
            upcoming: 'text-muted-foreground font-medium',
          };

          return (
            <li
              key={stepName}
              className="relative z-10 flex flex-col items-center flex-1 text-center space-y-2"
            >
              {/* Marker */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${markerClasses[status]}`}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : status === 'current' ? (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                ) : null}
              </div>

              {/* Label */}
              <span className={`text-sm sm:text-base ${labelClasses[status]}`}>{stepName}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
