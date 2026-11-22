"use client";

import React from "react";
import { Building2, Calendar, Droplet, History } from "lucide-react";
import { useMyDonations } from "@/hooks/useDonor";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BloodGroup } from "@/types";

export function DonationHistoryTable() {
  const { data, isLoading } = useMyDonations();

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  const donations = data?.donations ?? [];

  if (donations.length === 0) {
    return (
      <EmptyState
        title="No Blood Donations Recorded"
        description="You have not logged any blood donation records yet. When you fulfill emergency transfusions at verified hospitals, your records will be archived here."
        icon={History}
        actionLabel="Explore Emergency Requests"
        actionHref="/blood-requests"
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
          All Verified Donation Records
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {donations.length} {donations.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800 text-[10px]">
              <th className="pb-3 font-bold">Hospital Facility</th>
              <th className="pb-3 font-bold">Blood Group</th>
              <th className="pb-3 font-bold">Units</th>
              <th className="pb-3 font-bold">Donation Date</th>
              <th className="pb-3 font-bold text-right">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {donations.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{item.hospitalName || "Registered Hospital"}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <BloodGroupBadge
                    bloodGroup={(item.bloodRequest?.bloodGroup || item.donor?.bloodGroup) as BloodGroup}
                    size="sm"
                  />
                </td>
                <td className="py-3.5 pr-4 font-bold text-slate-800 dark:text-slate-200">
                  {item.unitsDonated} {item.unitsDonated === 1 ? "Bag" : "Bags"}
                </td>
                <td className="py-3.5 pr-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(item.donationDate || item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 text-right">
                  <StatusBadge status={item.verificationStatus || item.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
