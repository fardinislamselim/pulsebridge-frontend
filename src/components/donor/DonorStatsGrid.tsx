"use client";

import React from "react";
import { Droplet, Award, Activity, ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import type { DonorProfile, DonorEligibility, DonationHistorySummary } from "@/types";

interface DonorStatsGridProps {
  profile?: DonorProfile;
  eligibility?: DonorEligibility;
  summary?: DonationHistorySummary;
  isLoading?: boolean;
}

export function DonorStatsGrid({
  profile,
  eligibility,
  summary,
  isLoading = false,
}: DonorStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton count={4} />
      </div>
    );
  }

  const isEligible = eligibility?.isEligible ?? eligibility?.eligible ?? false;
  const remainingDays = eligibility?.remainingCooldownDays ?? eligibility?.daysRemaining ?? 0;
  const hasRestriction = profile?.hasMedicalRestriction ?? false;

  let statusText = "Eligible";
  let statusSub = "Ready for donation";
  let statusIcon = ShieldCheck;
  let statusColor = "text-emerald-600 dark:text-emerald-400";
  let statusBg = "bg-emerald-50 dark:bg-emerald-950/60";

  if (hasRestriction) {
    statusText = "Restricted";
    statusSub = "Medical pause active";
    statusIcon = ShieldAlert;
    statusColor = "text-red-600 dark:text-red-400";
    statusBg = "bg-red-50 dark:bg-red-950/60";
  } else if (!isEligible && remainingDays > 0) {
    statusText = `${remainingDays}d Cooldown`;
    statusSub = "Resting between donations";
    statusIcon = Clock;
    statusColor = "text-amber-600 dark:text-amber-400";
    statusBg = "bg-amber-50 dark:bg-amber-950/60";
  }

  const bloodGroupLabel = profile?.bloodGroup
    ? formatBloodGroup(profile.bloodGroup)
    : "Not Set";

  const completedCount = summary?.completedDonations ?? profile?.totalDonations ?? 0;
  const totalUnits = summary?.totalUnitsDonated ?? completedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Blood Group"
        value={bloodGroupLabel}
        subtitle={profile?.bloodGroup ? profile.bloodGroup.replace("_", " ") : "Complete your profile"}
        icon={Droplet}
        iconColorClass="text-red-600 dark:text-red-400"
        iconBgClass="bg-red-50 dark:bg-red-950/60"
      />

      <StatCard
        title="Completed Donations"
        value={completedCount}
        subtitle={`${completedCount} verified transfusions`}
        icon={Award}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-50 dark:bg-blue-950/60"
      />

      <StatCard
        title="Total Units Donated"
        value={`${totalUnits} Bags`}
        subtitle="Lives directly impacted"
        icon={Activity}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-50 dark:bg-purple-950/60"
      />

      <StatCard
        title="Eligibility Status"
        value={statusText}
        subtitle={statusSub}
        icon={statusIcon}
        iconColorClass={statusColor}
        iconBgClass={statusBg}
      />
    </div>
  );
}
