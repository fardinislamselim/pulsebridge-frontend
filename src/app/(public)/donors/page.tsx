import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { matchingService } from "@/services/matching.service";
import { DonorCard } from "@/components/public/DonorCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { MatchedEligibleDonor } from "@/types";

export const metadata: Metadata = {
  title: "Verified Donors Directory | PulseBridge",
  description:
    "Find verified, eligible blood donors with automated ABO/Rh compatibility across Bangladesh.",
};

/**
 * DonorsDirectoryPage - Pure Server Component (NO "use client")
 * Pre-renders verified public blood donors.
 */
export default async function DonorsDirectoryPage() {
  let donors: MatchedEligibleDonor[] = [];

  try {
    const res = await matchingService.findDonors({ limit: 20 });
    donors = res.data || [];
  } catch {
    donors = [];
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find Blood Donors
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse verified, active voluntary blood donors with medical cooldown compliance.
          </p>
        </div>

        <Link
          href="/register?role=DONOR"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          Join as Donor
        </Link>
      </div>

      {/* Donors Grid */}
      {donors.length === 0 ? (
        <EmptyState
          title="No Donors Currently Listed"
          description="Be the first hero in your area. Register as a voluntary donor to save lives."
          actionLabel="Register as Donor"
          actionHref="/register?role=DONOR"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donors.map((donor) => (
            <DonorCard key={donor.donorId} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
}
