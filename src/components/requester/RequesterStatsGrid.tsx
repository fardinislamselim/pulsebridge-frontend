import React from "react";
import { Clock, AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import type { BloodRequest } from "@/types";

interface RequesterStatsGridProps {
  requests: BloodRequest[];
  isLoading: boolean;
}

export function RequesterStatsGrid({ requests, isLoading }: RequesterStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton count={4} />
      </div>
    );
  }

  const totalRequests = requests.length;
  const activeRequests = requests.filter(
    (r) =>
      r.status === "PENDING" ||
      r.status === "APPROVED" ||
      r.status === "MATCHING" ||
      r.status === "IN_PROGRESS"
  ).length;

  const fulfilledUnits = requests.reduce(
    (acc, curr) => acc + (curr.unitsFulfilled || 0),
    0
  );

  const emergencyRequests = requests.filter(
    (r) => r.urgency === "EMERGENCY" && r.status !== "CANCELLED" && r.status !== "FULFILLED"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Requests"
        value={totalRequests}
        subtitle="All submitted cases"
        icon={Clock}
        iconBgClass="bg-blue-50 dark:bg-blue-950/60"
        iconColorClass="text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Active / Matching"
        value={activeRequests}
        subtitle="In queue or dispatch"
        icon={AlertTriangle}
        iconBgClass="bg-amber-50 dark:bg-amber-950/60"
        iconColorClass="text-amber-600 dark:text-amber-400"
      />

      <StatCard
        title="Units Received"
        value={`${fulfilledUnits} Units`}
        subtitle="Verified donated blood"
        icon={CheckCircle2}
        iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
        iconColorClass="text-emerald-600 dark:text-emerald-400"
      />

      <StatCard
        title="Emergency Cases"
        value={emergencyRequests}
        subtitle="Priority urgent dispatch"
        icon={AlertOctagon}
        iconBgClass="bg-red-50 dark:bg-red-950/60"
        iconColorClass="text-red-600 dark:text-red-400"
      />
    </div>
  );
}
