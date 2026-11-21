import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface FormSkeletonProps {
  fields?: number;
  columns?: 1 | 2;
  showButtons?: boolean;
  className?: string;
}

/**
 * FormSkeleton - Form input/label skeleton loader for async forms and modal dialogs
 */
export function FormSkeleton({
  fields = 4,
  columns = 2,
  showButtons = true,
  className,
}: FormSkeletonProps) {
  const gridClass = columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6",
        className
      )}
    >
      <div className={cn("grid gap-5", gridClass)}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {showButtons && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      )}
    </div>
  );
}
