import React from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Compass, HeartHandshake } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { MatchedEligibleDonor } from "@/types";

interface DonorCardProps {
  donor: MatchedEligibleDonor;
  requestId?: string;
  actionHref?: string;
}

/**
 * DonorCard - Reusable donor profile preview card
 */
export function DonorCard({ donor, requestId, actionHref }: DonorCardProps) {
  const logDonationUrl =
    actionHref ||
    (requestId
      ? `/requester/donations/log?requestId=${requestId}&donorProfileId=${donor.donorId}`
      : `/requester/donations/log?donorProfileId=${donor.donorId}`);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 transition flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {donor.donorName || "Verified Blood Donor"}
              </h3>
              {donor.isVerified && (
                <span title="Verified Donor" className="inline-flex text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span>
                {donor.city ? `${donor.city}, ` : ""}
                {donor.district || "Registered District"}
              </span>
            </div>
          </div>

          <BloodGroupBadge bloodGroup={donor.donorBloodGroup} size="sm" />
        </div>

        {/* Distance & Availability */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {donor.distanceKm !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
              <Compass className="h-3 w-3" />
              {donor.distanceKm < 1 ? "Nearby (< 1 km)" : `${donor.distanceKm.toFixed(1)} km away`}
            </span>
          )}

          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
              donor.isAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            {donor.isAvailable ? "Available to Donate" : "Recently Active"}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">ABO Compatible</span>
        <Link
          href={logDonationUrl}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/20 hover:bg-red-700 transition"
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          Log Donation
        </Link>
      </div>
    </div>
  );
}
