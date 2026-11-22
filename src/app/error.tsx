"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircleIcon, RotateCcwIcon, HomeIcon, ActivityIcon } from "lucide-react";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    // Log exception for monitoring
    console.error("[PulseBridge Root Runtime Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg w-full rounded-3xl border border-red-200/80 bg-white p-8 text-center shadow-xl shadow-red-500/5 dark:border-red-900/40 dark:bg-slate-900 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <ActivityIcon className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950/80 dark:text-red-300">
            <AlertCircleIcon className="h-3.5 w-3.5" />
            System Exception Encountered
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Temporary Medical Platform Disruption
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            PulseBridge caught an unexpected runtime error. Emergency network background monitors have been notified.
          </p>
        </div>

        {error?.message && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-left text-xs font-mono text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 break-words max-h-28 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 transition"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
