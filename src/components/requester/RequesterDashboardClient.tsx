"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  PlusCircle,
  Eye,
  CheckSquare,
  Ban,
  Building2,
  Calendar,
  Loader2,
  X,
  Search,
  Filter,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ApiResponse, BloodRequest } from "@/types";

// Validation schema for cancelling a request
const cancelSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Cancellation reason must be at least 3 characters")
    .max(500, "Reason cannot exceed 500 characters"),
});

type CancelFormData = z.infer<typeof cancelSchema>;

export function RequesterDashboardClient() {
  const queryClient = useQueryClient();

  // Search / Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Cancel Modal State
  const [requestToCancel, setRequestToCancel] = useState<BloodRequest | null>(
    null
  );

  const {
    register: registerCancel,
    handleSubmit: handleCancelSubmit,
    reset: resetCancelForm,
    formState: { errors: cancelErrors },
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "" },
  });

  // Query: GET /blood-requests/me
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<BloodRequest[]>>(
        "/blood-requests/me"
      );
      return response.data.data || [];
    },
  });

  // Mutation: PATCH /blood-requests/:requestId/cancel
  const cancelMutation = useMutation({
    mutationFn: async ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => {
      const response = await apiClient.patch<ApiResponse<BloodRequest>>(
        `/blood-requests/${requestId}/cancel`,
        { reason, cancellationReason: reason }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Request Cancelled", {
        description: "The blood request has been withdrawn from matching.",
      });
      setRequestToCancel(null);
      resetCancelForm();
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: unknown) => {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to cancel blood request.";
      toast.error("Action Failed", { description: apiMessage });
    },
  });

  const onConfirmCancel = (formData: CancelFormData) => {
    if (!requestToCancel) return;
    cancelMutation.mutate({
      requestId: requestToCancel.id,
      reason: formData.reason,
    });
  };

  const requests = data || [];

  // KPI Calculations
  const totalRequests = requests.length;

  const activeRequests = requests.filter(
    (r) =>
      r.status === "PENDING" ||
      r.status === "APPROVED" ||
      r.status === "MATCHING" ||
      r.status === "IN_PROGRESS"
  ).length;

  const fulfilledUnits = requests.reduce((acc, curr) => {
    return acc + (curr.unitsFulfilled || (curr.status === "FULFILLED" ? curr.unitsNeeded : 0));
  }, 0);

  const emergencyRequests = requests.filter(
    (r) => r.urgency === "EMERGENCY" && r.status !== "CANCELLED"
  ).length;

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton KPI Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        {/* Skeleton Table Card */}
        <div className="h-80 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
        <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-heading text-lg font-bold">
          Failed to load your blood requests
        </h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          Please check your network connection or authenticate again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Requests
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalRequests}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            All submitted cases
          </div>
        </div>

        {/* Active / Matching */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active / Matching
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {activeRequests}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            In queue or dispatch
          </div>
        </div>

        {/* Fulfilled Units */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Units Received
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {fulfilledUnits}{" "}
            <span className="text-sm font-semibold text-slate-400">Units</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Verified donated blood
          </div>
        </div>

        {/* Emergency Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Emergency Critical
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertOctagon className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-red-600">
            {emergencyRequests}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Immediate dispatch priority
          </div>
        </div>
      </div>

      {/* Main Requests Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              My Blood Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track real-time donor matching, request timelines, and donation verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="MATCHING">Matching</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests Table / Card List */}
        {filteredRequests.length === 0 ? (
          requests.length === 0 ? (
            <EmptyState
              title="No Blood Requests Submitted"
              description="You haven't submitted any blood donation requests yet. Submit a request to initiate automated ABO/Rh matching with nearby verified donors."
              icon={Heart}
              actionLabel="Create Blood Request"
              actionHref="/requester/requests/new"
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
              No blood requests match your search and filter criteria.
            </div>
          )
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Patient & Hospital</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Units Needed</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Needed At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRequests.map((req) => {
                  const needed = req.unitsNeeded || 1;
                  const fulfilled = req.unitsFulfilled || (req.status === "FULFILLED" ? needed : 0);
                  const progressPct = Math.min(100, Math.round((fulfilled / needed) * 100));

                  const canCancel =
                    req.status !== "CANCELLED" &&
                    req.status !== "FULFILLED" &&
                    req.status !== "REJECTED";

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Patient & Hospital */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {req.patientName}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[180px]">
                            {req.hospitalName}, {req.district}
                          </span>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4">
                        <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                      </td>

                      {/* Units Needed & Progress */}
                      <td className="py-3.5 px-4 min-w-[120px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>
                            {fulfilled} / {needed} Units
                          </span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                          <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={req.urgency} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={req.status} size="sm" />
                      </td>

                      {/* Needed Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {formatDate(req.neededAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Details */}
                          <Link
                            href={`/requester/requests/${req.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            title="View Details & Matches"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Details</span>
                          </Link>

                          {/* Log Donation Action */}
                          <Link
                            href={`/requester/donations/log?requestId=${req.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800 shadow-sm transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                            title="Log Received Donation"
                          >
                            <CheckSquare className="h-3 w-3" />
                            <span>Log</span>
                          </Link>

                          {/* Cancel Request Dialog Trigger */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => setRequestToCancel(req)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900/60 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40"
                              title="Cancel Request"
                            >
                              <Ban className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Request Modal Dialog */}
      {requestToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Cancel Blood Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRequestToCancel(null);
                  resetCancelForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel the request for{" "}
              <strong className="text-slate-900 dark:text-white">
                {requestToCancel.patientName}
              </strong>
              ? Donors currently alerted for this request will be released.
            </p>

            <form
              onSubmit={handleCancelSubmit(onConfirmCancel)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="cancelReason"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Cancellation Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="cancelReason"
                  rows={3}
                  placeholder="e.g., Blood obtained from hospital bank, patient discharged, or donor arranged locally."
                  disabled={cancelMutation.isPending}
                  {...registerCancel("reason")}
                  className={`mt-1.5 w-full rounded-lg border bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                    cancelErrors.reason
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                />
                {cancelErrors.reason && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {cancelErrors.reason.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={cancelMutation.isPending}
                  onClick={() => {
                    setRequestToCancel(null);
                    resetCancelForm();
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Keep Request
                </button>
                <button
                  type="submit"
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
