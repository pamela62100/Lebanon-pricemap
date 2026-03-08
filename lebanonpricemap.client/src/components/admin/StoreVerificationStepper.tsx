import { useState } from 'react';
import { cn } from '@/lib/utils';

const STEPS = [
  { title: 'Verify Business',      desc: 'Upload trade license or business registration' },
  { title: 'Confirm Location',     desc: 'Pin exact store location on the map' },
  { title: 'Choose Sync Method',   desc: 'Select how store will submit prices' },
  { title: 'Generate API Key',     desc: 'If API sync chosen, create credentials' },
  { title: 'Activate Store',       desc: 'Final review and go-live approval' },
];

interface StoreVerificationStepperProps {
  storeName: string;
  currentStep: number;
  onStepComplete: (step: number) => void;
  onActivate: () => void;
}

export function StoreVerificationStepper({ storeName, currentStep, onStepComplete, onActivate }: StoreVerificationStepperProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className="px-6 py-4 border-b border-border-soft">
        <p className="text-sm font-bold text-text-main">{storeName}</p>
        <p className="text-xs text-text-muted mt-0.5">Onboarding — Step {currentStep + 1} of {STEPS.length}</p>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-border-soft">
        <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const future = i > currentStep;
          return (
            <div key={i} className={cn('flex items-start gap-4 px-6 py-4 border-b border-border-soft last:border-0 transition-colors',
              active ? 'bg-primary/3' : future ? 'opacity-50' : ''
            )}>
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5',
                done   ? 'bg-green-500 text-white'
                : active ? 'bg-primary text-white'
                : 'bg-bg-muted border border-border-soft text-text-muted'
              )}>
                {done
                  ? <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                  : i + 1
                }
              </div>
              <div className="flex-1">
                <p className={cn('text-sm font-bold', active ? 'text-text-main' : done ? 'text-text-sub' : 'text-text-muted')}>{step.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
              </div>
              {active && (
                i === STEPS.length - 1
                  ? <button onClick={onActivate} className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:opacity-90 shrink-0">Activate</button>
                  : <button onClick={() => onStepComplete(i)} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 shrink-0">Complete →</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
