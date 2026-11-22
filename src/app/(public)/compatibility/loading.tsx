import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * CompatibilityLoading - Pure Server Component (NO "use client")
 * Renders skeleton loader matching the CompatibilityExplorer layout.
 */
export default function CompatibilityLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-10">
      {/* Header Banner Skeleton */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-800 p-8 sm:p-10 space-y-4">
        <Skeleton className="h-6 w-44 rounded-full" />
        <Skeleton className="h-10 w-96 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>

      {/* Section 1: Selector & Breakdown Skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* 8-button selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>

        {/* Breakdown Card skeleton */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-14 rounded-xl" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Section 2: Simulator Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-full mx-auto" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>

      {/* Section 3: Matrix Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
