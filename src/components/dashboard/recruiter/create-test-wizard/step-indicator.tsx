'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="relative flex items-center justify-between w-full overflow-x-auto px-2 sm:px-4 md:px-6">
        {/* Connector line */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full h-[2px] bg-gradient-to-r from-primary/60 to-secondary/50 blur-sm" />
        </div>

        {steps.map((stepName, idx) => {
          const status =
            idx < currentStep
              ? 'completed'
              : idx === currentStep
              ? 'current'
              : 'upcoming';

          const baseDotStyle =
            'h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 shadow-lg backdrop-blur-md';
          const statusStyles = {
            completed: 'bg-primary text-white border-primary shadow-primary/30',
            current:
              'bg-background text-primary border-primary ring-2 ring-primary/50',
            upcoming: 'bg-muted text-muted-foreground border-border',
          };

          return (
            <li key={stepName} className="relative flex flex-col items-center flex-1">
              <div
                className={cn(baseDotStyle, statusStyles[status])}
                aria-current={status === 'current' ? 'step' : undefined}
                title={stepName}
              >
                {status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : status === 'current' ? (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                ) : null}
              </div>

              {/* Label */}
              <p
                className={cn(
                  'mt-2 text-center text-xs sm:text-sm max-w-[80px] truncate',
                  {
                    'text-primary font-semibold': status === 'current',
                    'text-muted-foreground': status === 'upcoming',
                    'text-primary': status === 'completed',
                  }
                )}
              >
                {stepName}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
