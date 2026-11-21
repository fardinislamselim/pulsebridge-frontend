import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { bloodRequestService } from "@/services/blood-request.service";
import { BloodRequestCard } from "@/components/public/BloodRequestCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BloodRequest } from "@/types";

export const metadata: Metadata = {
  title: "Blood Requests Directory | PulseBridge",
  description:
    "Browse verified active emergency blood donation requests across hospitals in Bangladesh.",
};

/**
 * BloodRequestsDirectoryPage - Pure Server Component (NO "use client")
 * Pre-renders verified public blood requests.
 */
export default async function BloodRequestsDirectoryPage() {
  let requests: BloodRequest[] = [];

  try {
    const res = await bloodRequestService.getPublicRequests({ limit: 20 });
    requests = res.data || [];
  } catch {
    requests = [];
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Emergency Blood Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time public appeal directory for urgent hospital transfusions.
          </p>
        </div>

        <Link
          href="/requester/requests/new"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Request Blood
        </Link>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <EmptyState
          title="No Active Requests"
          description="There are currently no active public blood requests listed in the directory."
          actionLabel="Submit Blood Request"
          actionHref="/requester/requests/new"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => (
            <BloodRequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
