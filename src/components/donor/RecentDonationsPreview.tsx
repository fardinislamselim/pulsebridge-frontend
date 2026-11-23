"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight, Building2, Calendar } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Donation, BloodGroup } from "@/types";

interface RecentDonationsPreviewProps {
  donations?: Donation[];
  isLoading?: boolean;
}

export function RecentDonationsPreview({
  donations = [],
  isLoading = false,
}: RecentDonationsPreviewProps) {
  if (isLoading) {
    return <TableSkeleton rows={3} columns={4} />;
  }

  const latestDonations = donations.slice(0, 3);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Recent Blood Donations
            </h3>
            <p className="text-[11px] text-slate-500">Latest recorded clinical transfusions</p>
          </div>
        </div>

        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 transition"
        >
          <span>Find Requests</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {latestDonations.length === 0 ? (
        <EmptyState
          title="No Donations Recorded Yet"
          description="You haven't logged any blood donations yet. When you complete a verified transfusion, your record and cooldown will appear here."
          actionLabel="Explore Emergency Requests"
          actionHref="/blood-requests"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800 text-[10px]">
                <th className="pb-2.5 font-bold">Facility / Hospital</th>
                <th className="pb-2.5 font-bold">Date</th>
                <th className="pb-2.5 font-bold">Blood Group</th>
                <th className="pb-2.5 font-bold">Units</th>
                <th className="pb-2.5 font-bold text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {latestDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{d.hospitalName || "Hospital Facility"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{new Date(d.donationDate || d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <BloodGroupBadge bloodGroup={d.bloodRequest?.bloodGroup || d.donor?.bloodGroup as BloodGroup} size="sm" />
                  </td>
                  <td className="py-3 pr-3 font-bold text-slate-800 dark:text-slate-200">
                    {d.unitsDonated} {d.unitsDonated === 1 ? "Unit" : "Units"}
                  </td>
                  <td className="py-3 text-right">
                    <StatusBadge status={d.verificationStatus || d.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
