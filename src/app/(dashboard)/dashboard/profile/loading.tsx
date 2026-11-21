import React from "react";
import { Loader2 } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-96 rounded-md bg-slate-100 dark:bg-slate-900" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-24 rounded-md bg-slate-100 dark:bg-slate-900" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="h-11 rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-11 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
