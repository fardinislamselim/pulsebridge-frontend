import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  title?: string;
  className?: string;
}

export function ChartSkeleton({ title, className = "" }: ChartSkeletonProps) {
  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          {title ? (
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          ) : (
            <Skeleton className="h-5 w-44 rounded" />
          )}
          <Skeleton className="h-3.5 w-60 rounded" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="h-[260px] w-full flex items-end gap-2 pt-4 px-2">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </div>
  );
}
