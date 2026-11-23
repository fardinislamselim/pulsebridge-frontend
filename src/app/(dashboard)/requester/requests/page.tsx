import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, FileText, ArrowLeft } from "lucide-react";
import { RequesterRequestsClient } from "@/components/requester/RequesterRequestsClient";

export const metadata: Metadata = {
  title: "My Blood Requests | PulseBridge",
  description:
    "View, manage, and track all your active and previous emergency blood requests on PulseBridge.",
};

/**
 * RequesterRequestsPage - Pure Server Component (NO "use client")
 * Renders static page header with action buttons and delegates data table to RequesterRequestsClient.
 */
export default function RequesterRequestsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation Breadcrumb / Back Link */}
      <div>
        <Link
          href="/requester"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requester Portal
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Blood Requests
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track emergency cases, matching status, and clinical donation fulfillments.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/requester/requests/new"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            <PlusCircle className="h-4 w-4" />
            + Create New Request
          </Link>
        </div>
      </div>

      {/* Requests Table Client Component */}
      <RequesterRequestsClient />
    </div>
  );
}
