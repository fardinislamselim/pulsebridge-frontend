import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/shared/CardGridSkeleton";

export default function BloodRequestsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <CardGridSkeleton count={6} columns={3} />
    </div>
  );
}
