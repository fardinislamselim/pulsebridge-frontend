import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { CooldownCardSkeleton } from "@/components/donor/CooldownStatusCard";
import { AvailabilityCardSkeleton } from "@/components/donor/AvailabilityToggleCard";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

/**
 * DonorHubLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader matching DonorHub layout.
 */
export default function DonorHubLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 4 KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton count={4} />
      </div>

      {/* 2-Column Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CooldownCardSkeleton />
        <AvailabilityCardSkeleton />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={3} columns={5} />
    </div>
  );
}
