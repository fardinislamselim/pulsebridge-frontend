"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, AlertTriangle } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "@/constants/districts";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import type { BloodGroup, RequestUrgency } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const URGENCIES: { value: RequestUrgency; label: string }[] = [
  { value: "NORMAL", label: "Normal" },
  { value: "URGENT", label: "Urgent" },
  { value: "EMERGENCY", label: "Emergency" },
];

export function BloodRequestFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBloodGroup = searchParams.get("bloodGroup") || "";
  const currentDistrict = searchParams.get("district") || "";
  const currentUrgency = searchParams.get("urgency") || "";

  const hasActiveFilters = Boolean(currentBloodGroup || currentDistrict || currentUrgency);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Filter className="h-4 w-4 text-red-600" />
          <span>Filter Blood Requests</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Blood Group Filter */}
        <div>
          <label htmlFor="req-blood-group" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Blood Group
          </label>
          <select
            id="req-blood-group"
            value={currentBloodGroup}
            onChange={(e) => updateParam("bloodGroup", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {formatBloodGroup(group)} ({group.replace("_", " ")})
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label htmlFor="req-district" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            District
          </label>
          <select
            id="req-district"
            value={currentDistrict}
            onChange={(e) => updateParam("district", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="">All Districts</option>
            {BANGLADESH_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency Filter */}
        <div>
          <label htmlFor="req-urgency" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Urgency Level
          </label>
          <select
            id="req-urgency"
            value={currentUrgency}
            onChange={(e) => updateParam("urgency", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="">All Urgency Levels</option>
            {URGENCIES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
