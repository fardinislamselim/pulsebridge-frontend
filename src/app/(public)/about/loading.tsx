import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl space-y-16 animate-pulse">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex justify-center">
          <Skeleton className="h-6 w-48 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-14 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
