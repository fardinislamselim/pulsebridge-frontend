"use client";

import React, { useState } from "react";
import { useAdminDonors, useToggleDonorVerification } from "@/hooks/useAdminGovernance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { DonorRestrictionDialog } from "./DonorRestrictionDialog";
import { HeartHandshakeIcon, ShieldCheckIcon, ShieldOffIcon, StethoscopeIcon } from "lucide-react";
import type { PublicDonor } from "@/types";

export function DonorsGovernanceTable() {
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");
  const [selectedDonorForRestriction, setSelectedDonorForRestriction] = useState<PublicDonor | null>(null);

  const { data: donors, isLoading } = useAdminDonors(
    districtFilter !== "ALL" ? { district: districtFilter } : undefined
  );
  const toggleVerificationMutation = useToggleDonorVerification();

  const donorList = donors || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Unmasked Administrative Donor Registry
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">District:</label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Districts</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Khulna">Khulna</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} columns={6} />
          </div>
        ) : donorList.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={HeartHandshakeIcon}
              title="No Donors Found"
              description="No registered donors found for the selected geographic filter."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Donor</th>
                  <th className="px-5 py-3.5">Blood Group</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Medical Status</th>
                  <th className="px-5 py-3.5">Verification</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {donorList.map((donor: PublicDonor) => {
                  const hasRestriction = (donor as any)?.hasMedicalRestriction ?? false;
                  return (
                    <tr key={donor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {donor.user?.name || "Donor User"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">ID: {donor.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {donor.bloodGroup ? (
                          <BloodGroupBadge bloodGroup={donor.bloodGroup} />
                        ) : (
                          <span className="text-xs text-slate-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800 dark:text-slate-200">{donor.district || "—"}</div>
                        <div className="text-xs text-slate-400">{donor.city || donor.area || ""}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {hasRestriction ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                            Restricted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            Eligible
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() =>
                            toggleVerificationMutation.mutate({
                              id: donor.id,
                              isVerified: !donor.isVerified,
                            })
                          }
                          disabled={toggleVerificationMutation.isPending}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
 donor.isVerified
 ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
 : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
 }`}
                        >
                          {donor.isVerified ? (
                            <>
                              <ShieldCheckIcon className="h-3.5 w-3.5" /> Verified
                            </>
                          ) : (
                            <>
                              <ShieldOffIcon className="h-3.5 w-3.5" /> Unverified
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedDonorForRestriction(donor)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition-all"
                        >
                          <StethoscopeIcon className="h-3.5 w-3.5" /> Medical Triage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DonorRestrictionDialog
        donor={selectedDonorForRestriction}
        open={Boolean(selectedDonorForRestriction)}
        onOpenChange={(open) => !open && setSelectedDonorForRestriction(null)}
      />
    </div>
  );
}
