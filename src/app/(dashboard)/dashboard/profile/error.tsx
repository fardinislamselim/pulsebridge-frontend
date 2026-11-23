"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile error caught:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h2 className="font-heading text-lg font-bold">
          Failed to load profile details
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error?.message || "An unexpected error occurred while communicating with the server."}
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
