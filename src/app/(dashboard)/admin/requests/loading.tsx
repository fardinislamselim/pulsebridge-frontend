import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

/**
 * AdminRequestsLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader for the request moderation queue.
 */
export default function AdminRequestsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6">
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-44 rounded" />
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      <TableSkeleton rows={6} columns={6} />
    </div>
  );
}
