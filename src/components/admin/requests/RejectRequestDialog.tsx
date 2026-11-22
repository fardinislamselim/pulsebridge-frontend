"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useRejectRequest } from "@/hooks/useAdminModeration";

const rejectSchema = z.object({
  reason: z.string().trim().min(5, "Rejection reason must be at least 5 characters"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

interface RejectRequestDialogProps {
  requestId: string | null;
  patientName?: string;
  onClose: () => void;
}

export function RejectRequestDialog({
  requestId,
  patientName,
  onClose,
}: RejectRequestDialogProps) {
  const rejectMutation = useRejectRequest();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  if (!requestId) return null;

  const onSubmit = (data: RejectFormValues) => {
    rejectMutation.mutate(
      { id: requestId, reason: data.reason },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Reject Blood Request
            </h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          State the medical or administrative reason for rejecting the request for{" "}
          <strong className="text-slate-900 dark:text-white">{patientName || "this patient"}</strong>. The requester will be notified.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              {...register("reason")}
              rows={3}
              placeholder="e.g. Incomplete hospital documentation, duplicated emergency appeal..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
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
              type="submit"
              disabled={rejectMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              {rejectMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
