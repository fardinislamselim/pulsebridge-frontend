import React from "react";
import Link from "next/link";
import { Building2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { BloodRequest } from "@/types";

interface BloodRequestCardProps {
  request: BloodRequest;
  detailsHref?: string;
}

/**
 * BloodRequestCard - Reusable public / dashboard blood requirement card
 */
export function BloodRequestCard({ request, detailsHref }: BloodRequestCardProps) {
  const unitsNeeded = request.unitsNeeded || 1;
  const unitsFulfilled = request.unitsFulfilled || 0;
  const progressPercent = Math.min(100, Math.round((unitsFulfilled / unitsNeeded) * 100));

  const targetUrl = detailsHref || `/requester/requests/${request.id}`;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 transition flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {request.patientName}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span>
                {request.city}, {request.district}
              </span>
            </div>
          </div>

          <BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <StatusBadge status={request.urgency} size="sm" />
          <StatusBadge status={request.status} size="sm" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{request.hospitalName}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Needed by: {new Date(request.neededAt).toLocaleDateString()}</span>
        </div>

        {/* Units fulfillment progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Fulfillment</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {unitsFulfilled} / {unitsNeeded} Units ({progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                progressPercent >= 100
                  ? "bg-emerald-500"
                  : progressPercent > 0
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Case #{request.id.slice(-6).toUpperCase()}
        </span>
        <Link
          href={targetUrl}
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 transition"
        >
          View Details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
