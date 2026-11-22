import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { AdminRequestsTable } from "@/components/admin/requests/AdminRequestsTable";

export const metadata: Metadata = {
  title: "Blood Request Moderation Queue | Admin PulseBridge",
  description:
    "Review, approve, triage urgency, and moderate emergency patient blood requests across hospitals in Bangladesh.",
};

/**
 * AdminRequestsPage - Pure Server Component (NO "use client")
 * Serves the live blood request moderation triage queue for Administrators.
 */
export default function AdminRequestsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Command Center</span>
        </Link>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="h-4 w-4" />
          <span>Operations Moderation Queue</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Blood Request Moderation
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Validate clinical legitimacy, adjust urgency triages, and release appeals into the live donor matching network.
        </p>
      </div>

      <AdminRequestsTable />
    </div>
  );
}
