import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { ChartSkeleton } from "@/components/admin/charts/ChartSkeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

/**
 * AdminDashboardLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader matching the Admin Dashboard layout.
 */
export default function AdminDashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-8 w-72 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      {/* Control Bar Skeleton */}
      <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* 5 KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCardSkeleton count={5} />
      </div>

      {/* Main Growth Chart Skeleton */}
      <ChartSkeleton title="Platform Growth Trends" />

      {/* 2 Sub-Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton title="Requests by Urgency" />
        <ChartSkeleton title="Donations by Blood Group" />
      </div>

      {/* Activity Table Skeleton */}
      <TableSkeleton rows={5} columns={4} />
    </div>
  );
}
