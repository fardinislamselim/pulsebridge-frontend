import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicCardsSkeleton } from "@/components/public/PublicCardsSkeleton";

/**
 * DonorsLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader for verified donors directory.
 */
export default function DonorsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <PublicCardsSkeleton count={6} columns={3} />
    </div>
  );
}
