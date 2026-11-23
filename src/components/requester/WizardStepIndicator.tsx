import React from "react";
import { CheckCircle2 } from "lucide-react";

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  const steps = [
    { num: 1, label: "Patient & Blood" },
    { num: 2, label: "Hospital & Location" },
    { num: 3, label: "Urgency & Contact" },
  ];

  return (
    <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
      {steps.map((s, idx) => {
        const isDone = currentStep > s.num;
        const isActive = currentStep === s.num;

        return (
          <div key={s.num} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
 isDone
 ? "bg-emerald-600 text-white"
 : isActive
 ? "bg-red-600 text-white "
 : "bg-slate-100 text-slate-400 dark:bg-slate-800"
 }`}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Step {s.num}
              </span>
              <span
                className={`text-xs font-bold ${
 isActive ? "text-slate-900 dark:text-white" : "text-slate-400"
 }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block w-12 h-0.5 bg-slate-200 dark:bg-slate-800 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
