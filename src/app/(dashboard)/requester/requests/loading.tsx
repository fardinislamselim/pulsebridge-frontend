import React from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RequesterRequestsLoading - Pure Server Component (NO "use client")
 * Renders header skeletons and tabular data skeletons during route transitions.
 */
export default function RequesterRequestsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Link Skeleton */}
      <Skeleton className="h-4 w-36 rounded-md" />

      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
