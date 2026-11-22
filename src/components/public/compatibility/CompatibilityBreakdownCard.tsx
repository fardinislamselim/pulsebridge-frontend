"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft, Sparkles, ShieldAlert } from "lucide-react";
import { BloodGroupBadge, formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BloodGroup } from "@/types";

interface CompatibilityBreakdownCardProps {
  selectedGroup: BloodGroup;
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isLoading?: boolean;
}

export function CompatibilityBreakdownCard({
  selectedGroup,
  canDonateTo,
  canReceiveFrom,
  isLoading = false,
}: CompatibilityBreakdownCardProps) {
  const formatted = formatBloodGroup(selectedGroup);
  const isUniversalDonor = selectedGroup === "O_NEGATIVE";
  const isUniversalRecipient = selectedGroup === "AB_POSITIVE";

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-14 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <BloodGroupBadge bloodGroup={selectedGroup} size="lg" />
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Blood Type {formatted} Profile
            </h3>
            <p className="text-xs text-slate-500">ABO & Rh(D) Red Blood Cell compatibility analysis</p>
          </div>
        </div>

        {isUniversalDonor && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Universal RBC Donor
          </span>
        )}

        {isUniversalRecipient && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Universal RBC Recipient
          </span>
        )}
      </div>

      {/* Special Banner Callout */}
      {isUniversalDonor && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <Sparkles className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Universal Red Blood Cell Donor</p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/80">
              O-negative blood lacks A, B, and Rh antigens, making it the safest transfusion choice during immediate life-threatening trauma and emergency surgeries when crossmatching is pending.
            </p>
          </div>
        </div>
      )}

      {isUniversalRecipient && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
          <Sparkles className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold">Universal Red Blood Cell Recipient</p>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300/80">
              AB-positive individuals express A, B, and Rh antigens and possess neither anti-A nor anti-B antibodies in plasma, enabling them to safely receive packed red blood cells from any donor.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Can Donate / Can Receive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Can Donate To */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Can Donate To</h4>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {canDonateTo.length} {canDonateTo.length === 1 ? "group" : "groups"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {canDonateTo.map((group) => (
              <BloodGroupBadge key={group} bloodGroup={group} size="md" />
            ))}
          </div>
        </div>

        {/* Can Receive From */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Can Receive From</h4>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {canReceiveFrom.length} {canReceiveFrom.length === 1 ? "group" : "groups"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {canReceiveFrom.map((group) => (
              <BloodGroupBadge key={group} bloodGroup={group} size="md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
