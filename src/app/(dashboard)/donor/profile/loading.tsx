import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/shared/FormSkeleton";

/**
 * DonorProfileLoading - Pure Server Component (NO "use client")
 * Route-level skeleton loader for the donor profile editor.
 */
export default function DonorProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6 max-w-4xl">
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-7 w-52 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      <FormSkeleton fields={6} columns={2} />
    </div>
  );
}
