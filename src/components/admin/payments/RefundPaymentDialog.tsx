"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { refundPaymentSchema, type RefundPaymentFormData } from "@/schemas/governance.schema";
import { useRefundPayment } from "@/hooks/useAdminGovernance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RotateCcwIcon, AlertCircleIcon } from "lucide-react";
import type { Payment } from "@/types";

interface RefundPaymentDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RefundPaymentDialog({ payment, open, onOpenChange }: RefundPaymentDialogProps) {
  const refundMutation = useRefundPayment();
  const totalAmount = payment?.amount ?? 0;
  const alreadyRefunded = (payment as any)?.refundAmount ?? payment?.refundedAmount ?? 0;
  const maxRefundable = Math.max(0, totalAmount - alreadyRefunded);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<RefundPaymentFormData>({
    resolver: zodResolver(refundPaymentSchema),
    defaultValues: { amount: maxRefundable, reason: "" },
  });

  useEffect(() => {
    if (payment) {
      const remaining = Math.max(0, (payment.amount ?? 0) - ((payment as any)?.refundAmount ?? payment.refundedAmount ?? 0));
      reset({ amount: remaining, reason: "" });
    }
  }, [payment, reset]);

  const onSubmit = (values: RefundPaymentFormData) => {
    if (!payment) return;
    if (values.amount > maxRefundable) {
      setError("amount", {
        type: "manual",
        message: `Amount cannot exceed remaining refundable balance of ${payment.currency} ${maxRefundable}`,
      });
      return;
    }
    refundMutation.mutate(
      { paymentId: payment.id, payload: { amount: values.amount, reason: values.reason } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader className="space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <RotateCcwIcon className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Issue Payment Refund</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Process refund for transaction <span className="font-mono font-semibold text-slate-900 dark:text-white">{payment?.transactionId}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Original Total:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{payment?.currency} {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Refunded:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{payment?.currency} {alreadyRefunded.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 font-bold">
              <span className="text-slate-700 dark:text-slate-300">Max Refundable:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{payment?.currency} {maxRefundable.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Refund Amount *</label>
            <input type="number" step="any" {...register("amount")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Audit Reason *</label>
            <textarea {...register("reason")} rows={2} placeholder="Reason for reverse-settlement..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
          </div>

          <div className="rounded-xl bg-amber-500/10 p-2.5 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Submits immediate reverse-settlement request to {payment?.provider}.</span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={refundMutation.isPending || maxRefundable <= 0} className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm disabled:opacity-50">
              {refundMutation.isPending ? "Refunding..." : "Confirm Refund"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
