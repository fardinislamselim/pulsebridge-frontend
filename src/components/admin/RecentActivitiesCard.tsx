"use client";

import React from "react";
import { Activity, Clock, User, Layers } from "lucide-react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useRecentActivities } from "@/hooks/useAdmin";

export function RecentActivitiesCard() {
  const { data, isLoading } = useRecentActivities(1, 8);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  const activities = data?.activities ?? [];

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No Recent Activity Records"
        description="System events, donor verifications, request approvals, and audit trails will appear here."
        icon={Activity}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Recent System & Audit Trail Activities
            </h3>
            <p className="text-[11px] text-slate-500">Live operational events across PulseBridge</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">{activities.length} entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800 text-[10px]">
              <th className="pb-2.5 font-bold">Activity / Action</th>
              <th className="pb-2.5 font-bold">Initiated By</th>
              <th className="pb-2.5 font-bold">Target Resource</th>
              <th className="pb-2.5 font-bold text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                  <div>
                    <span>{act.title || act.type}</span>
                    {act.description && (
                      <p className="text-[11px] font-normal text-slate-500 truncate max-w-sm">
                        {act.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>{act.actor?.displayName || "System Automated"}</span>
                  </div>
                </td>
                <td className="py-3 pr-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    <Layers className="h-3 w-3 text-slate-400" />
                    {act.resource?.type || "General"}
                  </span>
                </td>
                <td className="py-3 text-right text-slate-500 text-[11px]">
                  <div className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>
                      {new Date(act.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
