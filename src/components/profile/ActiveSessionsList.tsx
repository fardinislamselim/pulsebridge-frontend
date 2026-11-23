"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Laptop,
  Smartphone,
  Globe,
  Clock,
  ShieldAlert,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CardGridSkeleton } from "@/components/shared/CardGridSkeleton";
import apiClient from "@/lib/axios";
import type { ApiResponse, SessionInfo } from "@/types";

export function ActiveSessionsList() {
  const queryClient = useQueryClient();

  // Query: GET /auth/sessions
  const { data, isLoading, error } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<{ sessions: SessionInfo[] }>
      >("/auth/sessions");
      return response.data.data?.sessions || [];
    },
  });

  // Mutation: DELETE /auth/sessions/:id
  const revokeMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiClient.delete<ApiResponse<unknown>>(
        `/auth/sessions/${sessionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Session Terminated", {
        description: "The selected device session has been revoked.",
      });
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: (err: unknown) => {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to revoke session.";
      toast.error("Action Failed", { description: apiMessage });
    },
  });

  // Mutation: POST /auth/logout-all
  const logoutAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/auth/logout-all"
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("All Sessions Terminated", {
        description: "All other device sessions have been safely logged out.",
      });
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: (err: unknown) => {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to terminate all sessions.";
      toast.error("Action Failed", { description: apiMessage });
    },
  });

  const getDeviceIcon = (os?: string | null, browser?: string | null) => {
    const combined = `${os || ""} ${browser || ""}`.toLowerCase();
    if (combined.includes("android") || combined.includes("ios") || combined.includes("mobile")) {
      return Smartphone;
    }
    return Laptop;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recently";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return <CardGridSkeleton count={2} columns={1} />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
        <AlertCircle className="h-4 w-4 mx-auto mb-1 text-red-600" />
        Unable to load active sessions.
      </div>
    );
  }

  const sessions = data || [];
  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Title & Bulk Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Active Device Sessions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage web and mobile devices currently signed into your PulseBridge account.
          </p>
        </div>

        {otherSessionsCount > 0 && (
          <button
            type="button"
            onClick={() => logoutAllMutation.mutate()}
            disabled={logoutAllMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 transition"
          >
            {logoutAllMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            )}
            Revoke All Other Devices ({otherSessionsCount})
          </button>
        )}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-800">
            No active sessions found.
          </div>
        ) : (
          sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.os, session.browser);

            return (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <DeviceIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {session.browser || "Unknown Browser"} on{" "}
                        {session.os || "Unknown Device"}
                      </span>
                      {session.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Current Device
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {session.ipAddress && (
                        <span className="font-mono text-[11px]">
                          IP: {session.ipAddress}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last Active: {formatDate(session.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() => revokeMutation.mutate(session.id)}
                    disabled={revokeMutation.isPending}
                    className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-300 transition"
                    title="Revoke session"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
                    Revoke
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
