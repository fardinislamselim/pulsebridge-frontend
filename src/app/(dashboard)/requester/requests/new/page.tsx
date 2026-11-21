import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";
import { CreateBloodRequestWizard } from "@/components/requester/CreateBloodRequestWizard";

export const metadata: Metadata = {
  title: "Create Blood Request | PulseBridge Blood & Emergency Platform",
  description:
    "Submit an emergency or scheduled blood donation request. PulseBridge immediately broadcasts to matching ABO/Rh compatible donors in your hospital's district.",
};

/**
 * NewBloodRequestPage - Pure Server Component (NO "use client")
 * Renders static page shell, breadcrumbs, safety assurance guidelines,
 * and delegates interactive wizard steps to CreateBloodRequestWizard.
 */
export default function NewBloodRequestPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/requester"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requester Portal
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          100% Free Public Emergency Service
        </div>
      </div>

      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Blood Request
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Provide accurate patient, hospital, and blood requirement details for instant ABO/Rh donor matching.
            </p>
          </div>
        </div>
      </div>

      {/* Client Component: 3-Step Wizard Form */}
      <CreateBloodRequestWizard />
    </div>
  );
}
