"use client";

import React from "react";
import { Users, UserCheck, AlertOctagon, HeartHandshake, CreditCard } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import type { DashboardOverviewData } from "@/types/admin.types";

interface AdminOverviewStatsProps {
  overview?: DashboardOverviewData;
  isLoading?: boolean;
}

export function AdminOverviewStats({ overview, isLoading = false }: AdminOverviewStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCardSkeleton count={5} />
      </div>
    );
  }

  const usersCount = overview?.users.total ?? 0;
  const donorsCount = overview?.donors.available ?? overview?.donors.eligible ?? 0;
  const emergencyCount = overview?.bloodRequests.emergency ?? overview?.emergency.activeRequests ?? 0;
  const donationsCount = overview?.donations.completed ?? 0;
  const totalUnits = overview?.donations.totalUnitsDonated ?? donationsCount;
  const netFunds = overview?.payments.netCollectedAmount ?? overview?.payments.totalSuccessfulAmount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Users"
        value={usersCount}
        subtitle={`${overview?.users.donors ?? 0} Donors | ${overview?.users.requesters ?? 0} Requesters`}
        icon={Users}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-50 dark:bg-blue-950/60"
      />

      <StatCard
        title="Ready Donors"
        value={donorsCount}
        subtitle={`${overview?.donors.total ?? 0} Registered voluntary`}
        icon={UserCheck}
        iconColorClass="text-emerald-600 dark:text-emerald-400"
        iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
      />

      <StatCard
        title="Emergency Appeals"
        value={emergencyCount}
        subtitle={`${overview?.bloodRequests.matching ?? 0} in active matching`}
        icon={AlertOctagon}
        iconColorClass="text-red-600 dark:text-red-400"
        iconBgClass="bg-red-50 dark:bg-red-950/60"
      />

      <StatCard
        title="Verified Donations"
        value={donationsCount}
        subtitle={`${totalUnits} blood bags saved`}
        icon={HeartHandshake}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-50 dark:bg-purple-950/60"
      />

      <StatCard
        title="Platform Funds"
        value={`${netFunds.toLocaleString()} BDT`}
        subtitle={`${overview?.payments.successful ?? 0} successful transfers`}
        icon={CreditCard}
        iconColorClass="text-amber-600 dark:text-amber-400"
        iconBgClass="bg-amber-50 dark:bg-amber-950/60"
      />
    </div>
  );
}
