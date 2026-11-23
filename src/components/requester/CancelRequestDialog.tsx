"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useCancelBloodRequest } from "@/hooks/useBloodRequests";
import type { BloodRequest } from "@/types";

const cancelSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Please provide a reason (at least 5 characters)")
    .max(500, "Reason cannot exceed 500 characters"),
});

type CancelFormData = z.infer<typeof cancelSchema>;

interface CancelRequestDialogProps {
  request: BloodRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelRequestDialog({
  request,
  isOpen,
  onClose,
}: CancelRequestDialogProps) {
  const cancelMutation = useCancelBloodRequest(request?.id || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "" },
  });

  if (!isOpen || !request) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CancelFormData) => {
    await cancelMutation.mutateAsync({ reason: data.reason });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 text-red-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cancel Blood Request
            </h3>
            <p className="text-xs text-slate-500">
              {request.patientName} • Case #{request.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Cancelling will withdraw this emergency request, notify assigned responders, and halt automated matching.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Blood arranged from hospital bank or donor arrived."
              {...register("reason")}
              className={`w-full rounded-lg border p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
 errors.reason
 ? "border-red-500 focus:ring-red-500/20"
 : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
 }`}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={cancelMutation.isPending}
              onClick={handleClose}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Keep Request
            </button>
            <button
              type="submit"
              disabled={cancelMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
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
  );
}
