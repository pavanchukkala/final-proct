// src/components/dashboard/recruiter/create-test-wizard/step-indicator.tsx

'use client';

import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * A visually appealing, animated step indicator with enhanced professional styling.
 */
export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <TooltipProvider>
      <nav aria-label="Progress" className="w-full">
        <ol className="relative flex justify-between items-center w-full">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted-foreground/20 transform -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((stepName, idx) => {
            const status =
              idx < currentStep
                ? 'completed'
                : idx === currentStep
                ? 'current'
                : 'upcoming';

            const ringColors = {
              completed: 'ring-primary',
              current: 'ring-ring ring-2 animate-pulse',
              upcoming: 'ring-border',
            };

            const nodeStyles = {
              completed: 'bg-primary text-primary-foreground',
              current: 'bg-background text-primary border-2 border-primary',
              upcoming: 'bg-background text-muted-foreground border-2 border-border',
            };

            return (
              <li key={stepName} className="relative z-10 flex flex-col items-center w-1/3 text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md ${nodeStyles[status]} ${ringColors[status]} transition-all duration-300`}
                    >
                      {status === 'completed' ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-base font-semibold">{idx + 1}</span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{stepName}</p>
                  </TooltipContent>
                </Tooltip>
                <span
                  className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${
                    status === 'completed'
                      ? 'text-primary'
                      : status === 'current'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stepName}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </TooltipProvider>
  );
}
