"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Edit3, XCircle, HeartHandshake, ChevronRight, AlertOctagon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useBloodRequestDetails, useBloodRequestHistory } from "@/hooks/useBloodRequests";
import { useMatchedDonors } from "@/hooks/useMatching";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RequestOverviewCard } from "@/components/requester/RequestOverviewCard";
import { EditRequestDialog } from "@/components/requester/EditRequestDialog";
import { CancelRequestDialog } from "@/components/requester/CancelRequestDialog";
import { RequestAuditTimeline } from "@/components/requester/RequestAuditTimeline";
import { MatchedDonorsGrid } from "@/components/requester/MatchedDonorsGrid";

interface RequestDetailsClientProps {
  requestId: string;
}

export function RequestDetailsClient({ requestId }: RequestDetailsClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: bloodRequest, isLoading: isRequestLoading, isError, refetch } = useBloodRequestDetails(requestId);
  const { data: history = [], isLoading: isHistoryLoading } = useBloodRequestHistory(requestId);
  const { data: matchedDonors = [], isLoading: isDonorsLoading } = useMatchedDonors(requestId);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Request link copied to clipboard!");
    }
  };

  if (isRequestLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-6">
            <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !bloodRequest) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <AlertOctagon className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
        <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Blood Request Not Found</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">The requested emergency case could not be retrieved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/requester" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Return to Portal
          </Link>
          <button type="button" onClick={() => refetch()} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isTerminalState =
    bloodRequest.status === "FULFILLED" ||
    bloodRequest.status === "CANCELLED" ||
    bloodRequest.status === "EXPIRED" ||
    bloodRequest.status === "REJECTED";

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/requester" className="hover:text-red-600 transition">Requester Portal</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[200px]">{bloodRequest.patientName}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Case #{bloodRequest.id.slice(-6).toUpperCase()}
            </h1>
            <BloodGroupBadge bloodGroup={bloodRequest.bloodGroup} size="lg" />
            <StatusBadge status={bloodRequest.status} />
            <StatusBadge status={bloodRequest.urgency} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          {!isTerminalState && (
            <>
              <button type="button" onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition">
                <Edit3 className="h-3.5 w-3.5" /> Edit Details
              </button>
              <button type="button" onClick={() => setIsCancelModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100/60 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 transition">
                <XCircle className="h-3.5 w-3.5" /> Cancel
              </button>
            </>
          )}
          <Link href={`/requester/donations/log?requestId=${bloodRequest.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition">
            <HeartHandshake className="h-4 w-4" /> Record Donation
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RequestOverviewCard request={bloodRequest} />
          <MatchedDonorsGrid donors={matchedDonors} isLoading={isDonorsLoading} requestId={bloodRequest.id} district={bloodRequest.district} />
        </div>
        <div>
          <RequestAuditTimeline history={history} isLoading={isHistoryLoading} createdAt={bloodRequest.createdAt} currentStatus={bloodRequest.status} />
        </div>
      </div>

      {/* Modals */}
      <EditRequestDialog request={bloodRequest} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <CancelRequestDialog request={bloodRequest} isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} />
    </div>
  );
}
