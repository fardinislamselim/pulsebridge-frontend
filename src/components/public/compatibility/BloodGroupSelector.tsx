"use client";

import React from "react";
import type { BloodGroup } from "@/types";

interface BloodGroupSelectorProps {
  selectedGroup: BloodGroup;
  onSelect: (group: BloodGroup) => void;
  className?: string;
}

const BLOOD_GROUPS: {
  value: BloodGroup;
  label: string;
  tag?: string;
  tagColor?: string;
}[] = [
  { value: "O_NEGATIVE", label: "O-", tag: "Universal Donor", tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "A_POSITIVE", label: "A+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "AB_POSITIVE", label: "AB+", tag: "Universal Recipient", tagColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
];

export function BloodGroupSelector({
  selectedGroup,
  onSelect,
  className = "",
}: BloodGroupSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Select Blood Group to Explore
        </label>
        <span className="text-xs text-slate-500">ABO & Rh(D) Factors</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {BLOOD_GROUPS.map((item) => {
          const isSelected = selectedGroup === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              className={`relative flex flex-col items-center justify-center py-3.5 px-3 rounded-2xl border transition-all text-center focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
 isSelected
 ? "bg-gradient-to-b from-red-600 to-red-700 text-white border-red-600 scale-[1.02]"
 : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80"
 }`}
            >
              <span className="text-xl font-black tracking-tight">{item.label}</span>
              {item.tag && (
                <span
                  className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border leading-tight ${
 isSelected
 ? "bg-white/20 text-white border-white/30"
 : item.tagColor
 }`}
                >
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
