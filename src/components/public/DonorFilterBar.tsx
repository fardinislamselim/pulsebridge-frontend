"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, Navigation, MapPinOff, Loader2 } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "@/constants/districts";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import type { BloodGroup } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
];

export function DonorFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const currentBloodGroup = searchParams.get("bloodGroup") || "";
  const currentDistrict = searchParams.get("district") || "";
  const currentAvailable = searchParams.get("isAvailable") || "";
  const currentVerified = searchParams.get("isVerified") || "";
  const hasCoordinates = Boolean(searchParams.get("latitude") && searchParams.get("longitude"));
  const hasActiveFilters = Boolean(currentBloodGroup || currentDistrict || currentAvailable || currentVerified || hasCoordinates);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNearbyToggle = () => {
    if (hasCoordinates) {
      const params = new URLSearchParams(searchParams.toString());
      ["latitude", "longitude", "radiusKm"].forEach((k) => params.delete(k));
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }
    if (!navigator.geolocation) {
      setGeoError("Geolocation unsupported");
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("latitude", pos.coords.latitude.toFixed(6));
        params.set("longitude", pos.coords.longitude.toFixed(6));
        params.set("radiusKm", "15");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      },
      () => {
        setIsLocating(false);
        setGeoError("Location denied");
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Filter className="h-4 w-4 text-red-600" />
          <span>Filter Donors</span>
        </div>
        <div className="flex items-center gap-3">
          {geoError && <span className="text-red-500 text-[11px] font-medium">{geoError}</span>}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => router.push(pathname)}
              className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div>
          <label htmlFor="donor-bg" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
          <select id="donor-bg" value={currentBloodGroup} onChange={(e) => updateParam("bloodGroup", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((g) => (<option key={g} value={g}>{formatBloodGroup(g)} ({g.replace("_", " ")})</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="donor-dst" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
          <select id="donor-dst" value={currentDistrict} onChange={(e) => updateParam("district", e.target.value)} disabled={hasCoordinates} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white disabled:opacity-50">
            <option value="">{hasCoordinates ? "Filtered by GPS" : "All Districts"}</option>
            {BANGLADESH_DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="donor-avail" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Availability</label>
          <select id="donor-avail" value={currentAvailable} onChange={(e) => updateParam("isAvailable", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <option value="">All Donors</option>
            <option value="true">Available Now Only</option>
          </select>
        </div>

        <div>
          <label htmlFor="donor-verified" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Verification</label>
          <select id="donor-verified" value={currentVerified} onChange={(e) => updateParam("isVerified", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <option value="">All Statuses</option>
            <option value="true">Verified Donors Only</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button type="button" onClick={handleNearbyToggle} disabled={isLocating} className={`w-full py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all text-xs h-[38px] ${hasCoordinates ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"}`}>
            {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasCoordinates ? <MapPinOff className="h-3.5 w-3.5" /> : <Navigation className="h-3.5 w-3.5 text-red-600" />}
            <span>{hasCoordinates ? "Nearby (15km) \u00D7" : "Nearby Donors"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
