import React from "react";

export default function NewBloodRequestLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Top Navigation Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-48 rounded-full bg-slate-200 dark:bg-slate-800 hidden sm:block" />
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-3.5 w-96 rounded bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>

      {/* Wizard Card Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-8">
        {/* Progress Stepper Skeleton */}
        <div className="flex justify-between items-center px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-1 hidden sm:block">
                <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Step Body Skeleton */}
        <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
          <div className="h-11 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
