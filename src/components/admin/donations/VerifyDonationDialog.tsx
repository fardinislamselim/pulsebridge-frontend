"use client";

import React, { useState } from "react";
import { X, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useVerifyDonation } from "@/hooks/useAdminModeration";
import type { Donation } from "@/types";

interface VerifyDonationDialogProps {
  donation: Donation | null;
  onClose: () => void;
}

export function VerifyDonationDialog({ donation, onClose }: VerifyDonationDialogProps) {
  const [notes, setNotes] = useState("");
  const verifyMutation = useVerifyDonation();

  if (!donation) return null;

  const handleConfirm = () => {
    verifyMutation.mutate(
      { id: donation.id, notes },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Verify Clinical Donation
            </h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Atomic Multi-Domain Update</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            Verifying this transfusion will automatically increment the fulfilled units for the associated blood request and initiate a mandatory <strong>90-day medical cooldown</strong> for the voluntary donor.
          </p>
        </div>

        <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
          <p><strong>Facility:</strong> {donation.hospitalName || "Registered Hospital"}</p>
          <p><strong>Volume:</strong> {donation.unitsDonated} {donation.unitsDonated === 1 ? "Unit" : "Units"}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Verification Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Lab crossmatch confirmed, blood bag sealed"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={verifyMutation.isPending}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {verifyMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Confirm & Verify</span>
          </button>
        </div>
      </div>
    </div>
  );
}
