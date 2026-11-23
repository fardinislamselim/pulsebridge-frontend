"use client";

import React, { useState } from "react";
import { X, AlertOctagon, Loader2, Check } from "lucide-react";
import { useUpdateRequestUrgency } from "@/hooks/useAdminModeration";
import type { RequestUrgency } from "@/types";

interface UpdateUrgencyDialogProps {
  requestId: string | null;
  currentUrgency?: RequestUrgency;
  onClose: () => void;
}

const URGENCIES: { value: RequestUrgency; label: string; desc: string; color: string }[] = [
  { value: "NORMAL", label: "Normal", desc: "Routine elective or scheduled surgery", color: "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200" },
  { value: "URGENT", label: "Urgent", desc: "Required within 6 to 12 hours", color: "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200" },
  { value: "EMERGENCY", label: "Emergency", desc: "Life-threatening immediate priority", color: "border-red-200 bg-red-50/50 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200" },
];

export function UpdateUrgencyDialog({
  requestId,
  currentUrgency = "NORMAL",
  onClose,
}: UpdateUrgencyDialogProps) {
  const [selected, setSelected] = useState<RequestUrgency>(currentUrgency);
  const urgencyMutation = useUpdateRequestUrgency();

  if (!requestId) return null;

  const handleConfirm = () => {
    urgencyMutation.mutate(
      { id: requestId, urgency: selected },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <AlertOctagon className="h-5 w-5 text-red-600" />
            <h3 className="font-heading text-sm font-bold">Update Request Urgency Triage</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {URGENCIES.map((u) => {
            const isSelected = selected === u.value;
            return (
              <button
                key={u.value}
                type="button"
                onClick={() => setSelected(u.value)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
 isSelected ? "ring-2 ring-red-500/40 font-bold " + u.color : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
 }`}
              >
                <div>
                  <span className="text-xs font-bold block">{u.label}</span>
                  <span className="text-[11px] text-slate-500 opacity-90">{u.desc}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={urgencyMutation.isPending || selected === currentUrgency}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {urgencyMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Update Triage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
