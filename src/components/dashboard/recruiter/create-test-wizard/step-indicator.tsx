// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
        {steps.map((stepName, stepIdx) => (
          <li
            key={stepName}
            className={cn(
              'relative flex-1 min-w-[8rem] text-center',
              stepIdx < steps.length - 1 ? 'pr-4 sm:pr-8' : ''
            )}
          >
            {/* Connector line */}
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div
                className={cn(
                  'h-0.5 w-full',
                  stepIdx < currentStep ? 'bg-primary' : 'bg-border'
                )}
              />
            </div>

            {/* Step marker */}
            {stepIdx < currentStep ? (
              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
            ) : stepIdx === currentStep ? (
              <div
                className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                aria-current="step"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
              </div>
            ) : (
              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-muted-foreground/30"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Label */}
            <p
              className={cn(
                'mt-2 text-xs sm:text-sm whitespace-normal break-words',
                stepIdx < currentStep
                  ? 'font-medium text-primary'
                  : stepIdx === currentStep
                  ? 'font-semibold text-primary'
                  : 'font-medium text-muted-foreground'
              )}
            >
              {stepName}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
