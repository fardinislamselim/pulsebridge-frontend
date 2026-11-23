"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowLeftRight, AlertCircle, ShieldCheck } from "lucide-react";
import { usePairwiseCompatibility } from "@/hooks/useCompatibility";
import { BloodGroupBadge, formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BloodGroup } from "@/types";

const ALL_GROUPS: BloodGroup[] = [
  "O_NEGATIVE",
  "O_POSITIVE",
  "A_NEGATIVE",
  "A_POSITIVE",
  "B_NEGATIVE",
  "B_POSITIVE",
  "AB_NEGATIVE",
  "AB_POSITIVE",
];

export function PairwiseCompatibilityTester() {
  const [donor, setDonor] = useState<BloodGroup>("O_NEGATIVE");
  const [recipient, setRecipient] = useState<BloodGroup>("A_POSITIVE");

  const { data, isLoading } = usePairwiseCompatibility(donor, recipient);

  const handleSwap = () => {
    const temp = donor;
    setDonor(recipient);
    setRecipient(temp);
  };

  const isCompatible = data?.compatible ?? false;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
            Pairwise Compatibility Simulator
          </h3>
          <p className="text-xs text-slate-500">Test direct donor-to-recipient packed RBC transfusions</p>
        </div>
      </div>

      {/* Selectors and Swap Button */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-3">
        {/* Donor Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Donor Blood Group
          </label>
          <select
            value={donor}
            onChange={(e) => setDonor(e.target.value as BloodGroup)}
            aria-label="Donor Blood Group"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            {ALL_GROUPS.map((g) => (
              <option key={g} value={g}>
                {formatBloodGroup(g)} ({g.replace("_", " ")})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pt-5 sm:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Donor and Recipient"
            aria-label="Swap Donor and Recipient"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        {/* Recipient Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Recipient Blood Group
          </label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as BloodGroup)}
            aria-label="Recipient Blood Group"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            {ALL_GROUPS.map((g) => (
              <option key={g} value={g}>
                {formatBloodGroup(g)} ({g.replace("_", " ")})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Outcome Result Box */}
      {isLoading ? (
        <Skeleton className="h-28 rounded-xl" />
      ) : (
        <div
          className={`rounded-2xl border p-5 transition-all ${
 isCompatible
 ? "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
 : "border-red-200 bg-red-50/80 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
 }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              {isCompatible ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white ">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white ">
                  <XCircle className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-sm font-bold">
                  {isCompatible ? "Medically Compatible Match" : "Incompatible Transfusion Risk"}
                </span>
                <span className="text-xs opacity-75">
                  ({formatBloodGroup(donor)} &rarr; {formatBloodGroup(recipient)})
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {data?.reason ||
                  (isCompatible
                    ? `Donor ${formatBloodGroup(donor)} red blood cells do not expose antigens targeted by recipient ${formatBloodGroup(recipient)} antibodies.`
                    : `Recipient ${formatBloodGroup(recipient)} plasma contains antibodies that attack donor ${formatBloodGroup(donor)} red cell antigens.`)}
              </p>

              <div className="flex items-center gap-1.5 pt-1.5 text-[11px] opacity-75">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Pre-transfusion crossmatching is mandatory before actual clinical administration.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
