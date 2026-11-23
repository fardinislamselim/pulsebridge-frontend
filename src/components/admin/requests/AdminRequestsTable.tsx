"use client";

import React, { useState } from "react";
import { Check, X, Clock, AlertTriangle, Layers, Building2 } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAdminBloodRequests, useApproveRequest, useExpireRequest } from "@/hooks/useAdminModeration";
import { RejectRequestDialog } from "./RejectRequestDialog";
import { UpdateUrgencyDialog } from "./UpdateUrgencyDialog";
import type { BloodRequest, RequestStatus, RequestUrgency, BloodGroup } from "@/types";

export function AdminRequestsTable() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [rejectTarget, setRejectTarget] = useState<BloodRequest | null>(null);
  const [urgencyTarget, setUrgencyTarget] = useState<BloodRequest | null>(null);

  const filters: Record<string, any> = {};
  if (statusFilter !== "ALL") filters.status = statusFilter;
  if (urgencyFilter !== "ALL") filters.urgency = urgencyFilter;

  const { data: requests = [], isLoading } = useAdminBloodRequests(filters);
  const approveMutation = useApproveRequest();
  const expireMutation = useExpireRequest();

  if (isLoading) return <TableSkeleton rows={6} columns={6} />;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {["ALL", "PENDING", "APPROVED", "MATCHING", "FULFILLED", "EXPIRED"].map((st) => (
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

        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          aria-label="Filter by Urgency Level"
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="ALL">All Urgencies</option>
          <option value="EMERGENCY">Emergency Only</option>
          <option value="URGENT">Urgent Only</option>
          <option value="NORMAL">Normal Only</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No Blood Requests Match Queue" description="All requests have been moderated or no appeals match current filter criteria." icon={Layers} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800 text-[10px]">
                <th className="pb-2.5 font-bold">Patient & Hospital</th>
                <th className="pb-2.5 font-bold">Group</th>
                <th className="pb-2.5 font-bold">Units</th>
                <th className="pb-2.5 font-bold">Urgency</th>
                <th className="pb-2.5 font-bold">Status</th>
                <th className="pb-2.5 font-bold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                    <div>
                      <span>{req.patientName}</span>
                      <div className="flex items-center gap-1 text-[11px] font-normal text-slate-500">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate max-w-[160px]">{req.hospitalName} ({req.district})</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <BloodGroupBadge bloodGroup={req.bloodGroup as BloodGroup} size="sm" />
                  </td>
                  <td className="py-3 pr-3 font-bold text-slate-700 dark:text-slate-300">
                    {req.unitsFulfilled ?? 0} / {req.unitsNeeded ?? 1}
                  </td>
                  <td className="py-3 pr-3"><StatusBadge status={req.urgency} size="sm" /></td>
                  <td className="py-3 pr-3"><StatusBadge status={req.status} size="sm" /></td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(req.id)}
                            title="Approve Request"
                            className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(req)}
                            title="Reject Request"
                            className="p-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => setUrgencyTarget(req)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                      >
                        Triage
                      </button>
                      {!["FULFILLED", "EXPIRED", "CANCELLED", "REJECTED"].includes(req.status) && (
                        <button
                          type="button"
                          onClick={() => expireMutation.mutate(req.id)}
                          title="Force Expire"
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RejectRequestDialog requestId={rejectTarget?.id ?? null} patientName={rejectTarget?.patientName} onClose={() => setRejectTarget(null)} />
      <UpdateUrgencyDialog requestId={urgencyTarget?.id ?? null} currentUrgency={urgencyTarget?.urgency} onClose={() => setUrgencyTarget(null)} />
    </div>
  );
}
