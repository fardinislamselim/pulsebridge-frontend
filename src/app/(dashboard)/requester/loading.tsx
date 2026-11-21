import React from "react";

export default function RequesterLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-2">
          <div className="h-8 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-md bg-slate-100 dark:bg-slate-900" />
        </div>
        <div className="h-10 w-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="mt-4 h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800/50" />
      </div>
    </div>
  );
}
