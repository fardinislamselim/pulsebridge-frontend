"use client";

import React, { useState } from "react";
import { Check, X, Building2, Calendar, User, HeartHandshake } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAdminDonations, useRejectDonation } from "@/hooks/useAdminModeration";
import { VerifyDonationDialog } from "./VerifyDonationDialog";
import type { Donation, BloodGroup } from "@/types";

export function AdminDonationsTable() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [verifyTarget, setVerifyTarget] = useState<Donation | null>(null);

  const filters: Record<string, any> = {};
  if (statusFilter !== "ALL") filters.verificationStatus = statusFilter;

  const { data: donations = [], isLoading } = useAdminDonations(filters);
  const rejectMutation = useRejectDonation();

  if (isLoading) return <TableSkeleton rows={6} columns={6} />;

  const handleRejectPrompt = (d: Donation) => {
    const reason = window.prompt("Reason for rejecting this donation record:", "Verification mismatch or donor withdrawn");
    if (reason && reason.trim()) {
      rejectMutation.mutate({ id: d.id, reason: reason.trim() });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {["ALL", "PENDING", "VERIFIED", "REJECTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === st ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500">{donations.length} records</span>
      </div>

      {donations.length === 0 ? (
        <EmptyState title="No Donation Records" description="No donation verification records match the selected filter." icon={HeartHandshake} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800 text-[10px]">
                <th className="pb-2.5 font-bold">Donor Information</th>
                <th className="pb-2.5 font-bold">Blood Group</th>
                <th className="pb-2.5 font-bold">Hospital Facility</th>
                <th className="pb-2.5 font-bold">Units</th>
                <th className="pb-2.5 font-bold">Status</th>
                <th className="pb-2.5 font-bold text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{d.donor?.user?.name || d.donor?.name || "Verified Donor"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <BloodGroupBadge bloodGroup={(d.bloodRequest?.bloodGroup || d.donor?.bloodGroup) as BloodGroup} size="sm" />
                  </td>
                  <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{d.hospitalName || "Registered Hospital"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 font-bold text-slate-800 dark:text-slate-200">
                    {d.unitsDonated} {d.unitsDonated === 1 ? "Bag" : "Bags"}
                  </td>
                  <td className="py-3 pr-3">
                    <StatusBadge status={d.verificationStatus || d.status} size="sm" />
                  </td>
                  <td className="py-3 text-right">
                    {d.verificationStatus === "PENDING" || d.status === "PENDING" ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setVerifyTarget(d)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Verify</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectPrompt(d)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <VerifyDonationDialog donation={verifyTarget} onClose={() => setVerifyTarget(null)} />
    </div>
  );
}
