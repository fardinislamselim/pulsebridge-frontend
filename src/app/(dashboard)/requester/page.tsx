import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { RequesterDashboardClient } from "@/components/requester/RequesterDashboardClient";

export const metadata: Metadata = {
  title: "Requester Dashboard | PulseBridge Blood & Emergency Platform",
  description:
    "Manage your active blood donation requests, monitor automated ABO/Rh donor matching, and log verified donations.",
};

/**
 * RequesterDashboardPage - Pure Server Component (NO "use client")
 * Renders static dashboard header with CTA and delegates dynamic client queries to RequesterDashboardClient.
 */
export default function RequesterDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Dashboard Top Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Requester Portal
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time ABO/Rh donor matches, verify donation receipts, and manage emergency hospital dispatch.
          </p>
        </div>

        <div>
          <Link
            href="/requester/requests/new"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Blood Request
          </Link>
        </div>
      </div>

      {/* Interactive Client Component */}
      <RequesterDashboardClient />
    </div>
  );
}
