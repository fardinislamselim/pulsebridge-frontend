"use client";

import React from "react";
import { Radio, ShieldAlert, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useToggleAvailability } from "@/hooks/useDonor";
import { Skeleton } from "@/components/ui/skeleton";
import type { DonorProfile, DonorEligibility } from "@/types";

interface AvailabilityToggleCardProps {
  profile?: DonorProfile;
  eligibility?: DonorEligibility;
  isLoading?: boolean;
}

export function AvailabilityCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export function AvailabilityToggleCard({
  profile,
  eligibility,
  isLoading = false,
}: AvailabilityToggleCardProps) {
  const toggleMutation = useToggleAvailability();

  if (isLoading) return <AvailabilityCardSkeleton />;

  const isAvailable = profile?.isAvailable ?? false;
  const remainingCooldownDays = eligibility?.remainingCooldownDays ?? eligibility?.daysRemaining ?? 0;
  const isCooldownActive = remainingCooldownDays > 0;
  const hasMedicalRestriction = profile?.hasMedicalRestriction ?? false;
  const isLocked = isCooldownActive || hasMedicalRestriction;

  const handleToggle = () => {
    if (isLocked || toggleMutation.isPending) return;
    toggleMutation.mutate(!isAvailable);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Emergency Network Availability
            </h3>
            <p className="text-[11px] text-slate-500">Live matching algorithm dispatch</p>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
            isLocked
              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
              : isAvailable
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          {isAvailable && !isLocked && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {isLocked ? "Locked" : isAvailable ? "Active on Network" : "Paused"}
        </span>
      </div>

      {/* Warning Callout when Locked */}
      {isLocked ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Availability Locked by Medical Safety Protocol</p>
            <p className="mt-0.5 text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              {hasMedicalRestriction
                ? `A clinical restriction is on file: ${profile?.medicalRestrictionReason || "Please consult a hematologist."}`
                : `You are in a mandatory 90-day biological recovery period (${remainingCooldownDays} days remaining). You will be automatically eligible once completed.`}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          When active, verified hospitals and patients in your district can match with your profile during critical blood emergencies.
        </p>
      )}

      {/* Interactive Toggle Switch */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {isAvailable ? "Ready to Donate" : "Unavailable to Donate"}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={isAvailable}
          disabled={isLocked || toggleMutation.isPending}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
            isLocked
              ? "opacity-40 cursor-not-allowed bg-slate-300 dark:bg-slate-700"
              : isAvailable
              ? "bg-emerald-600"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
              isAvailable ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
