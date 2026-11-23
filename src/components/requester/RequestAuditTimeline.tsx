import React from "react";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BloodRequestHistoryItem, RequestStatus } from "@/types";

interface RequestAuditTimelineProps {
  history: BloodRequestHistoryItem[];
  isLoading: boolean;
  createdAt: string;
  currentStatus: RequestStatus;
}

export function RequestAuditTimeline({
  history,
  isLoading,
  createdAt,
  currentStatus,
}: RequestAuditTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <History className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Audit Lifecycle Timeline
          </h3>
          <p className="text-[11px] text-slate-400">
            Immutable audit records of state transitions
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-2.5 w-40 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="relative pl-6 pb-2 border-l-2 border-slate-200 dark:border-slate-800 text-xs">
          <div className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-red-600 ring-4 ring-white dark:ring-slate-900" />
          <div className="font-semibold text-slate-900 dark:text-white">Request Initiated</div>
          <div className="text-slate-500 text-[11px]">Status: {currentStatus}</div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            {new Date(createdAt).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="space-y-5 relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4 text-xs">
          {history.map((event, idx) => {
            const isLatest = idx === history.length - 1;
            return (
              <div key={event.id || idx} className="relative group">
                <div
                  className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${
 isLatest ? "bg-red-600" : "bg-slate-400 dark:bg-slate-600"
 }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {event.action.replace(/_/g, " ")}
                    </span>
                    {event.newStatus && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {event.newStatus}
                      </span>
                    )}
                  </div>

                  {event.reason && (
                    <p className="mt-1 text-slate-600 dark:text-slate-300 italic">
                      &quot;{event.reason}&quot;
                    </p>
                  )}

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span>
                      {new Date(event.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    {event.actor?.name && (
                      <>
                        <span>•</span>
                        <span>By {event.actor.name} ({event.actor.role})</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
