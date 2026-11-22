import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

/**
 * DonationHistoryLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader for donation history archive.
 */
export default function DonationHistoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton count={3} />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
