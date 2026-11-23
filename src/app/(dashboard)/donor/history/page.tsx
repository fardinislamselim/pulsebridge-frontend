import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, History, HeartHandshake } from "lucide-react";
import { DonationSummaryBanner } from "@/components/donor/DonationSummaryBanner";
import { DonationHistoryTable } from "@/components/donor/DonationHistoryTable";

export const metadata: Metadata = {
  title: "Donation History & Transfusion Records | PulseBridge",
  description:
    "Review your lifetime verified voluntary blood donations, medical certifications, and biological cooldown compliance.",
};

/**
 * DonationHistoryPage - Pure Server Component (NO "use client")
 * Serves the full donation archive for the authenticated donor.
 */
export default function DonationHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <Link
            href="/donor"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Donor Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-red-600" />
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Donation History & Records
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Official chronological log of your hospital blood donations and verified life-saving contributions.
          </p>
        </div>

        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition"
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Find Urgent Requests</span>
        </Link>
      </div>

      {/* Summary KPI Banner */}
      <DonationSummaryBanner />

      {/* Complete History Table */}
      <DonationHistoryTable />
    </div>
  );
}
