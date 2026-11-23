"use client";

import React, { useState } from "react";
import { useMyBloodRequests } from "@/hooks/useBloodRequests";
import { MyRequestsTable } from "@/components/requester/MyRequestsTable";
import { CancelRequestDialog } from "@/components/requester/CancelRequestDialog";
import type { BloodRequest } from "@/types";

export function RequesterRequestsClient() {
  const { data: requests = [], isLoading } = useMyBloodRequests();
  const [requestToCancel, setRequestToCancel] = useState<BloodRequest | null>(null);

  return (
    <div className="space-y-6">
      <MyRequestsTable
        requests={requests}
        isLoading={isLoading}
        onCancelRequest={(req) => setRequestToCancel(req)}
      />

      <CancelRequestDialog
        request={requestToCancel}
        isOpen={!!requestToCancel}
        onClose={() => setRequestToCancel(null)}
      />
    </div>
  );
}
