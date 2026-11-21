import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";

export default function PublicLoading() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:py-24 space-y-12">
      {/* Hero Skeleton */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <div className="inline-flex justify-center">
          <Skeleton className="h-6 w-64 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-xl" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto rounded-md" />
        <div className="pt-4 flex justify-center gap-4">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardSkeleton count={3} />
      </div>
    </div>
  );
}
