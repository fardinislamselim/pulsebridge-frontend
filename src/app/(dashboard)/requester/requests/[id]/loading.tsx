import React from "react";

export default function RequestDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-44 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          <div className="h-72 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-80 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          <div className="h-44 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-96 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
