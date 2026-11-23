import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicBloodRequestDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl space-y-6">
      <Skeleton className="h-4 w-36 rounded" />

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-64 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <Skeleton className="h-12 w-16 rounded-2xl" />
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-56 rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
        </div>

        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}
