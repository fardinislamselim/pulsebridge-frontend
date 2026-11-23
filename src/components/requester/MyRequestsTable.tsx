"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, HeartHandshake, XCircle, Search, Filter } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BloodRequest } from "@/types";

interface MyRequestsTableProps {
  requests: BloodRequest[];
  isLoading: boolean;
  onCancelRequest: (request: BloodRequest) => void;
}

export function MyRequestsTable({
  requests,
  isLoading,
  onCancelRequest,
}: MyRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No Blood Requests Found"
        description="You have not created any emergency blood requests yet."
        actionLabel="Create Blood Request"
        actionHref="/requester/requests/new"
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, hospital, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 p-2 text-xs focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="MATCHING">Matching Donors</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold dark:border-slate-800 dark:bg-slate-950/40">
            <tr>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Blood Group</th>
              <th className="py-3 px-3">Hospital</th>
              <th className="py-3 px-3">Units Progress</th>
              <th className="py-3 px-3">Urgency</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRequests.map((req) => {
              const needed = req.unitsNeeded || 1;
              const fulfilled = req.unitsFulfilled || 0;
              const isTerminal =
                req.status === "FULFILLED" ||
                req.status === "CANCELLED" ||
                req.status === "EXPIRED";

              return (
                <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {req.patientName}
                  </td>
                  <td className="py-3 px-3">
                    <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    <div className="font-medium truncate max-w-[150px]">{req.hospitalName}</div>
                    <div className="text-[11px] text-slate-400">{req.city}, {req.district}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {fulfilled} / {needed}
                    </span>
                    <span className="text-slate-400 ml-1">Units</span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={req.urgency} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/requester/requests/${req.id}`}
                        title="View Case Details"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/requester/donations/log?requestId=${req.id}`}
                        title="Log Donation"
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <HeartHandshake className="h-4 w-4" />
                      </Link>
                      {!isTerminal && (
                        <button
                          type="button"
                          onClick={() => onCancelRequest(req)}
                          title="Cancel Request"
                          className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <XCircle className="h-4 w-4" />
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
    </div>
  );
}
