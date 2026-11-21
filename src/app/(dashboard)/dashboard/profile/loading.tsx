import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/shared/FormSkeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <FormSkeleton fields={4} columns={2} showButtons={true} />
    </div>
  );
}
