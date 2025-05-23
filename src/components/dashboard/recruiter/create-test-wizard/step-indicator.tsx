// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex justify-between items-center">
        {steps.map((stepName, stepIdx) => (
          <li key={stepName} className="relative flex flex-col items-center flex-1">
            {/* Connector line (except first) */}
            {stepIdx > 0 && (
              <span
                className={`absolute left-0 top-1/2 w-full h-px bg-${
                  stepIdx <= currentStep ? 'primary' : 'border'
                } transform -translate-y-1/2`}
                aria-hidden="true"
              />
            )}

            {/* Marker */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 mb-2
                ${
                  stepIdx < currentStep
                    ? 'border-primary bg-primary'
                    : stepIdx === currentStep
                    ? 'border-primary bg-background'
                    : 'border-border bg-background'
                }
              `}
              aria-current={stepIdx === currentStep ? 'step' : undefined}
            >
              {stepIdx < currentStep ? (
                <Check className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              ) : (
                <span
                  className={`block h-2 w-2 rounded-full
                    ${stepIdx === currentStep ? 'bg-primary' : 'bg-transparent'}
                  `}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Label */}
            <p className={`text-center text-sm w-16 break-words
              ${
                stepIdx < currentStep
                  ? 'font-medium text-primary'
                  : stepIdx === currentStep
                  ? 'font-semibold text-primary'
                  : 'font-medium text-muted-foreground'
              }
            `}>
              {stepName}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
