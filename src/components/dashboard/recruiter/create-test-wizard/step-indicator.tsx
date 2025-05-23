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
      <ol role="list" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map((stepName, stepIdx) => (
          <li key={stepName} className="relative flex items-center justify-center">
            {/* Connector line (only for non-first items) */}
            {stepIdx > 0 && (
              <span
                className={`absolute left-0 top-1/2 w-full h-0.5 transform -translate-x-full bg-${
                  stepIdx <= currentStep ? 'primary' : 'border'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Step marker */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2"
              className={
                `flex h-10 w-10 items-center justify-center rounded-full border-2 ` +
                (stepIdx < currentStep
                  ? 'border-primary bg-primary'
                  : stepIdx === currentStep
                  ? 'border-primary bg-background'
                  : 'border-border bg-background')
              }
              aria-current={stepIdx === currentStep ? 'step' : undefined}
            >
              {stepIdx < currentStep ? (
                <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              ) : (
                <span className={
                  `block h-2.5 w-2.5 rounded-full ` +
                  (stepIdx === currentStep ? 'bg-primary' : 'bg-transparent')
                } aria-hidden="true" />
              )}
            </div>

            {/* Label */}
            <p className={`mt-2 text-center text-sm ` +
              (stepIdx < currentStep
                ? 'font-medium text-primary'
                : stepIdx === currentStep
                ? 'font-semibold text-primary'
                : 'font-medium text-muted-foreground')
            }>
              {stepName}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
