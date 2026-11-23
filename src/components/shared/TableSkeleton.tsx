import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * TableSkeleton - Configurable skeleton for tabular data views
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
 "w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900",
 className
 )}
    >
      {showHeader && (
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      )}

      <div className="mt-4 space-y-3">
        {/* Table Header Row Skeleton */}
        <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="col-span-2">
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid grid-cols-12 items-center gap-3 py-3 border-b border-slate-50 last:border-0 dark:border-slate-800/50"
          >
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="col-span-2">
                <Skeleton
                  className={cn(
 "h-4 rounded",
 c === 0 ? "w-28" : c === 1 ? "w-14" : "w-20"
 )}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
