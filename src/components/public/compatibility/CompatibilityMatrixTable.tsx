"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { RBC_DONOR_RULES } from "@/hooks/useCompatibility";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import type { BloodGroup } from "@/types";

interface CompatibilityMatrixTableProps {
  highlightGroup?: BloodGroup;
  onSelectGroup?: (group: BloodGroup) => void;
}

const GROUPS: BloodGroup[] = [
  "O_NEGATIVE",
  "O_POSITIVE",
  "A_NEGATIVE",
  "A_POSITIVE",
  "B_NEGATIVE",
  "B_POSITIVE",
  "AB_NEGATIVE",
  "AB_POSITIVE",
];

export function CompatibilityMatrixTable({
  highlightGroup,
  onSelectGroup,
}: CompatibilityMatrixTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
            Comprehensive 8x8 ABO/Rh Compatibility Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Donor blood groups (rows) &times; Recipient blood groups (columns) for Packed Red Blood Cells
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
            <span>Compatible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <X className="h-3.5 w-3.5" />
            </span>
            <span>Incompatible</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-xs font-bold text-left text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Donor \ Recipient
              </th>
              {GROUPS.map((recipient) => (
                <th
                  key={recipient}
                  className={`p-2.5 text-xs font-bold tracking-tight ${
                    highlightGroup === recipient
                      ? "text-red-600 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 rounded-t-lg"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {formatBloodGroup(recipient)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {GROUPS.map((donor) => {
              const isDonorRowHighlighted = highlightGroup === donor;
              return (
                <tr
                  key={donor}
                  className={`transition-colors ${
                    isDonorRowHighlighted
                      ? "bg-red-50/40 dark:bg-red-950/20"
                      : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <td className="p-2.5 text-left">
                    <button
                      type="button"
                      onClick={() => onSelectGroup?.(donor)}
                      className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                        isDonorRowHighlighted
                          ? "bg-red-600 text-white"
                          : "text-slate-800 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {formatBloodGroup(donor)}
                    </button>
                  </td>

                  {GROUPS.map((recipient) => {
                    const isCompatible = RBC_DONOR_RULES[donor]?.includes(recipient);
                    return (
                      <td key={recipient} className="p-2.5">
                        {isCompatible ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-300 dark:text-slate-700">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
