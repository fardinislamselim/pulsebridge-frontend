"use client";

import React from "react";
import { ShieldCheck, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DonorEligibility } from "@/types";

interface CooldownStatusCardProps {
  eligibility?: DonorEligibility;
  isLoading?: boolean;
}

export function CooldownCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-5 w-44 rounded" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

export function CooldownStatusCard({
  eligibility,
  isLoading = false,
}: CooldownStatusCardProps) {
  if (isLoading) return <CooldownCardSkeleton />;

  const isEligible = eligibility?.isEligible ?? eligibility?.eligible ?? true;
  const remainingDays = eligibility?.remainingCooldownDays ?? eligibility?.daysRemaining ?? 0;
  const lastDonationDate = eligibility?.lastDonationDate;
  const eligibleAt = eligibility?.eligibleAt ?? eligibility?.cooldownEndsAt;

  // 90-day cooldown progress calculation
  const totalDays = 90;
  const elapsedDays = Math.max(0, totalDays - remainingDays);
  const progressPercent = isEligible ? 100 : Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              90-Day Medical Cooldown
            </h3>
            <p className="text-[11px] text-slate-500">WHO RBC regeneration compliance</p>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
 isEligible
 ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
 : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
 }`}
        >
          {isEligible ? "Safe to Donate" : `${remainingDays} Days Left`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Biological Recovery</span>
          <span className="text-slate-900 dark:text-white">{progressPercent}% Completed</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
 isEligible ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-amber-600"
 }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Date Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="text-slate-500 block text-[11px] font-medium">Last Donation Date</span>
          <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
            {lastDonationDate ? new Date(lastDonationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "None on record"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="text-slate-500 block text-[11px] font-medium">Next Eligible Date</span>
          <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
            {isEligible ? "Eligible Today" : eligibleAt ? new Date(eligibleAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Evaluating"}
          </span>
        </div>
      </div>

      {/* Clinical Notes / Reasons */}
      {eligibility?.reasons && eligibility.reasons.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>Eligibility Requirements</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
            {eligibility.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
