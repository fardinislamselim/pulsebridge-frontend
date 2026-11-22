import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { AdminDonationsTable } from "@/components/admin/donations/AdminDonationsTable";

export const metadata: Metadata = {
  title: "Donation Verification Queue | Admin PulseBridge",
  description:
    "Review clinical blood donation records, verify life-saving transfusions, and activate automated 90-day medical cooldowns.",
};

/**
 * AdminDonationsPage - Pure Server Component (NO "use client")
 * Serves the hospital donation verification queue for Administrators.
 */
export default function AdminDonationsPage() {
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
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <HeartHandshake className="h-4 w-4" />
          <span>Clinical Verification Queue</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Donation Verification & Auditing
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify physical hospital blood donations to atomically fulfill patient requests and start donor 90-day biological cooldowns.
        </p>
      </div>

      <AdminDonationsTable />
    </div>
  );
}
