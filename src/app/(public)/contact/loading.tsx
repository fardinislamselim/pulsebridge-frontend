import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/shared/FormSkeleton";

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl space-y-12 animate-pulse">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex justify-center">
          <Skeleton className="h-6 w-44 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="lg:col-span-2">
          <FormSkeleton fields={5} columns={2} showButtons={true} />
        </div>
      </div>
    </div>
  );
}
