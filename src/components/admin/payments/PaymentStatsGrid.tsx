"use client";

import React from "react";
import { useAdminPaymentStats } from "@/hooks/useAdminGovernance";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { WalletIcon, DollarSignIcon, RotateCcwIcon, TrendingUpIcon } from "lucide-react";

export function PaymentStatsGrid() {
  const { data: stats, isLoading } = useAdminPaymentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton count={4} />
      </div>
    );
  }

  const overview = stats?.overview;
  const bdtBreakdown = stats?.currencyBreakdown?.BDT;
  const usdBreakdown = stats?.currencyBreakdown?.USD;

  const totalBdtCollected = bdtBreakdown?.successfulAmount ?? 0;
  const totalUsdCollected = usdBreakdown?.successfulAmount ?? 0;
  const totalRefunded =
    (bdtBreakdown?.refundedAmount ?? 0) + (usdBreakdown?.refundedAmount ?? 0);

  const totalPayments = overview?.totalPayments ?? 0;
  const successfulPayments = overview?.successfulPayments ?? 0;
  const successRate =
    totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total BDT Collected"
        value={`৳${totalBdtCollected.toLocaleString()}`}
        subtitle={`${bdtBreakdown?.transactionCount ?? 0} BDT Transactions`}
        icon={WalletIcon}
        iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
        iconColorClass="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        title="Total USD Collected"
        value={`$${totalUsdCollected.toLocaleString()}`}
        subtitle={`${usdBreakdown?.transactionCount ?? 0} Stripe Transactions`}
        icon={DollarSignIcon}
        iconBgClass="bg-blue-50 dark:bg-blue-950/60"
        iconColorClass="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        title="Refunded Volume"
        value={`৳${totalRefunded.toLocaleString()}`}
        subtitle={`${overview?.refundedPayments ?? 0} refunded records`}
        icon={RotateCcwIcon}
        iconBgClass="bg-amber-50 dark:bg-amber-950/60"
        iconColorClass="text-amber-600 dark:text-amber-400"
      />
      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        subtitle={`${successfulPayments} of ${totalPayments} processed`}
        icon={TrendingUpIcon}
        iconBgClass="bg-red-50 dark:bg-red-950/60"
        iconColorClass="text-red-600 dark:text-red-400"
      />
    </div>
  );
}
