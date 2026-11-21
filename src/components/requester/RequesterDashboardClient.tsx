"use client";

import React, { useState } from "react";
import { useMyBloodRequests } from "@/hooks/useBloodRequests";
import { RequesterStatsGrid } from "@/components/requester/RequesterStatsGrid";
import { MyRequestsTable } from "@/components/requester/MyRequestsTable";
import { CancelRequestDialog } from "@/components/requester/CancelRequestDialog";
import type { BloodRequest } from "@/types";

/**
 * RequesterDashboardClient - Modular Orchestrator Component
 * Coordinates KPI stats, filtered requests table, and cancellation dialog.
 */
export function RequesterDashboardClient() {
  const { data: requests = [], isLoading } = useMyBloodRequests();
  const [requestToCancel, setRequestToCancel] = useState<BloodRequest | null>(null);

  return (
    <div className="space-y-8">
      {/* 1. Summary KPI Metric Cards */}
      <RequesterStatsGrid requests={requests} isLoading={isLoading} />

      {/* 2. Requests Table */}
      <MyRequestsTable
        requests={requests}
        isLoading={isLoading}
        onCancelRequest={(req) => setRequestToCancel(req)}
      />

      {/* 3. Cancel Dialog */}
      <CancelRequestDialog
        request={requestToCancel}
        isOpen={!!requestToCancel}
        onClose={() => setRequestToCancel(null)}
      />
    </div>
  );
}
