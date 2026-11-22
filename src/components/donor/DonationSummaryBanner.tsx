"use client";

import React from "react";
import { Award, Droplets, Clock } from "lucide-react";
import { useMyDonations } from "@/hooks/useDonor";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";

export function DonationSummaryBanner() {
  const { data, isLoading } = useMyDonations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton count={3} />
      </div>
    );
  }

  const summary = data?.summary;
  const completedDonations = summary?.completedDonations ?? 0;
  const totalUnits = summary?.totalUnitsDonated ?? completedDonations;
  const lastDonationDate = summary?.lastDonationDate;

  const formattedDate = lastDonationDate
    ? new Date(lastDonationDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No prior records";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Completed Donations"
        value={completedDonations}
        subtitle="Verified transfusions"
        icon={Award}
        iconColorClass="text-emerald-600 dark:text-emerald-400"
        iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
      />

      <StatCard
        title="Total Blood Donated"
        value={`${totalUnits} Bags`}
        subtitle="Packed red blood cells"
        icon={Droplets}
        iconColorClass="text-red-600 dark:text-red-400"
        iconBgClass="bg-red-50 dark:bg-red-950/60"
      />

      <StatCard
        title="Latest Donation"
        value={formattedDate}
        subtitle={summary?.remainingCooldownDays ? `${summary.remainingCooldownDays}d remaining in cooldown` : "Full clinical clearance"}
        icon={Clock}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-50 dark:bg-blue-950/60"
      />
    </div>
  );
}
