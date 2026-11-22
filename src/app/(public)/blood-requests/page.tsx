import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, HeartPulse } from "lucide-react";
import { publicService } from "@/services/public.service";
import { BloodRequestCard } from "@/components/public/BloodRequestCard";
import { BloodRequestFilterBar } from "@/components/public/BloodRequestFilterBar";
import { UrlPagination } from "@/components/shared/UrlPagination";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BloodGroup, RequestUrgency, BloodRequest } from "@/types";

export const metadata: Metadata = {
  title: "Emergency Blood Requests Feed | PulseBridge",
  description:
    "Live verified public blood transfusion requests across hospitals in Bangladesh. Filter by blood group, district, and emergency level.",
};

interface BloodRequestsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * BloodRequestsPage - Pure Server Component (NO "use client")
 * URL-synchronized public blood requests feed with server-side pagination and filters.
 */
export default async function BloodRequestsPage({ searchParams }: BloodRequestsPageProps) {
  const params = await searchParams;

  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1;
  const limit = 12;
  const bloodGroup = typeof params.bloodGroup === "string" ? (params.bloodGroup as BloodGroup) : undefined;
  const district = typeof params.district === "string" ? params.district : undefined;
  const urgency = typeof params.urgency === "string" ? (params.urgency as RequestUrgency) : undefined;

  let requests: BloodRequest[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const res = await publicService.getPublicBloodRequests({
      page,
      limit,
      bloodGroup,
      district,
      urgency,
    });
    requests = res.data || [];
    total = res.meta?.total ?? requests.length;
    totalPages = res.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  } catch {
    requests = [];
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartPulse className="h-4 w-4" />
            <span>Emergency Coordination Feed</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Active Blood Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time verified requests from patients and hospital facilities across Bangladesh.
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

      {/* Filter Bar */}
      <BloodRequestFilterBar />

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <EmptyState
          title="No Matching Blood Requests"
          description="We couldn't find any active blood requests matching your current filter criteria. Try broadening your search or submit a new emergency request."
          actionLabel="Submit Blood Request"
          actionHref="/requester/requests/new"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <BloodRequestCard key={req.id} request={req} />
            ))}
          </div>

          <UrlPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
          />
        </div>
      )}
    </div>
  );
}
