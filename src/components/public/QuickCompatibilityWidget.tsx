"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Activity, Sparkles } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { BloodGroup } from "@/types";

const GROUPS: { label: string; value: BloodGroup }[] = [
  { label: "O-", value: "O_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "A+", value: "A_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
];

// Offline clinical ABO/Rh compatibility matrix
const COMPATIBILITY_RULES: Record<BloodGroup, BloodGroup[]> = {
  O_NEGATIVE: [
    "O_NEGATIVE", "O_POSITIVE", "A_NEGATIVE", "A_POSITIVE",
    "B_NEGATIVE", "B_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE",
  ],
  O_POSITIVE: ["O_POSITIVE", "A_POSITIVE", "B_POSITIVE", "AB_POSITIVE"],
  A_NEGATIVE: ["A_NEGATIVE", "A_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  A_POSITIVE: ["A_POSITIVE", "AB_POSITIVE"],
  B_NEGATIVE: ["B_NEGATIVE", "B_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  B_POSITIVE: ["B_POSITIVE", "AB_POSITIVE"],
  AB_NEGATIVE: ["AB_NEGATIVE", "AB_POSITIVE"],
  AB_POSITIVE: ["AB_POSITIVE"],
};

export function QuickCompatibilityWidget() {
  const [donorGroup, setDonorGroup] = useState<BloodGroup>("O_NEGATIVE");
  const [recipientGroup, setRecipientGroup] = useState<BloodGroup>("A_POSITIVE");

  const isCompatible = COMPATIBILITY_RULES[donorGroup]?.includes(recipientGroup) ?? false;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Interactive ABO/Rh Compatibility Checker
            </h3>
            <p className="text-xs text-slate-500">Test red blood cell donor-to-recipient compatibility</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="h-3 w-3" /> Live Rule Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        {/* Donor Group Picker */}
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            1. Select Donor Blood Group
          </label>
          <div className="grid grid-cols-4 gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setDonorGroup(g.value)}
                className={`py-2 rounded-xl text-center font-bold transition-all border ${
 donorGroup === g.value
 ? "bg-red-600 text-white border-red-600 "
 : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
 }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Group Picker */}
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            2. Select Recipient Blood Group
          </label>
          <div className="grid grid-cols-4 gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setRecipientGroup(g.value)}
                className={`py-2 rounded-xl text-center font-bold transition-all border ${
 recipientGroup === g.value
 ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
 : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
 }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <div
        className={`rounded-xl p-4 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
 isCompatible
 ? "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
 : "border-red-200 bg-red-50/80 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
 }`}
      >
        <div className="flex items-center gap-3">
          {isCompatible ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600 shrink-0" />
          )}
          <div className="text-xs">
            <span className="font-bold text-sm block">
              {isCompatible ? "Safe Transfusion Compatible!" : "Incompatible Transfusion Match"}
            </span>
            <span className="opacity-80">
              {isCompatible
                ? "This donor red cell type lacks antigens that would trigger recipient antibody reactions."
                : "Recipient antibodies would cross-react and destroy donor red blood cells."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/requester/requests/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            Request Blood <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
