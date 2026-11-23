import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserCog, HeartPulse } from "lucide-react";
import { DonorHubClient } from "@/components/donor/DonorHubClient";

export const metadata: Metadata = {
  title: "Donor Hub & Cooldown Management | PulseBridge",
  description:
    "Manage your voluntary donor availability, monitor WHO 90-day biological cooldown, and track verified blood donation records.",
};

/**
 * DonorDashboardPage - Pure Server Component (NO "use client")
 * Serves the authenticated Donor Hub dashboard.
 */
export default function DonorDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartPulse className="h-4 w-4" />
            <span>Voluntary Donor Portal</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Donor Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control your emergency availability, track biological cooldown, and review your donation impact.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <UserCog className="h-4 w-4 text-slate-500" />
            Edit Profile
          </Link>
          <Link
            href="/blood-requests"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            <HeartPulse className="h-4 w-4" />
            Urgent Requests
          </Link>
        </div>
      </div>

      {/* Donor Hub Client Container */}
      <DonorHubClient />
    </div>
  );
}
