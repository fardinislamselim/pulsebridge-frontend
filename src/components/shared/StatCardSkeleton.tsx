import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatCardSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * StatCardSkeleton - Metric card skeleton with matching dimensions
 */
export function StatCardSkeleton({ count = 1, className }: StatCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900",
            className
          )}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="mt-3 h-8 w-16 rounded-md" />
          <Skeleton className="mt-2 h-3 w-32 rounded" />
        </div>
      ))}
    </>
  );
}
