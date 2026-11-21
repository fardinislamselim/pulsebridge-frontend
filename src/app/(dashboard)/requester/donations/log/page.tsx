import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import { LogDonationForm } from "@/components/requester/LogDonationForm";

export const metadata: Metadata = {
  title: "Log Blood Donation | PulseBridge Blood & Emergency Platform",
  description:
    "Record a completed blood donation for clinical verification and automated request fulfillment.",
};

function LogDonationSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/**
 * LogDonationPage - Pure Server Component (NO "use client")
 * Wraps LogDonationForm inside Suspense to support useSearchParams without client bailout.
 */
export default function LogDonationPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Log Blood Donation
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Submit verified donation receipts from the hospital transfusion center.
          </p>
        </div>
      </div>

      {/* Interactive Form Component wrapped in Suspense */}
      <Suspense fallback={<LogDonationSkeleton />}>
        <LogDonationForm />
      </Suspense>
    </div>
  );
}
