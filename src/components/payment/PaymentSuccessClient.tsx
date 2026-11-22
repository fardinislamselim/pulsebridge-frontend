"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2Icon, AlertTriangleIcon, ShieldCheckIcon, ArrowRightIcon, RotateCcwIcon, HomeIcon, LayersIcon } from "lucide-react";

export function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") || searchParams.get("id") || searchParams.get("tran_id") || searchParams.get("transactionId") || searchParams.get("session_id") || "";

  const { data: verificationData, isLoading, isError, refetch } = useQuery({
    queryKey: ["payment-verification", paymentId],
    queryFn: async () => {
      if (!paymentId) throw new Error("No payment reference found");
      return (await paymentService.verifyPaymentById(paymentId)).data;
    },
    enabled: Boolean(paymentId),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <div className="space-y-3 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !paymentId) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-900/40 dark:bg-slate-900 space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <AlertTriangleIcon className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Verification Pending</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {paymentId ? "Could not verify automatically. If charged, gateway will reconcile shortly." : "No payment ID in return URL."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {paymentId && (
            <button onClick={() => refetch()} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition">
              <RotateCcwIcon className="h-3.5 w-3.5" /> Re-check Status
            </button>
          )}
          <Link href="/dashboard/support-us" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 transition">
            Platform Support
          </Link>
        </div>
      </div>
    );
  }

  const result = verificationData!;
  const amount = result.amount ?? 0;
  const currency = result.currency ?? "BDT";
  const transactionId = result.transactionId || result.paymentId || paymentId;

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2Icon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Payment Verified</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Thank you for supporting PulseBridge emergency blood coordination!</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/60 dark:bg-slate-800/30 space-y-3 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Verified Amount:</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">{currency} {amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Status:</span>
          <StatusBadge status={result.status || "SUCCESS"} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Transaction ID:</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{transactionId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Payment Gateway:</span>
          <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <LayersIcon className="h-3 w-3" />
            {result.provider || "GATEWAY"}
          </span>
        </div>
        {result.paidAt && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Date & Time:</span>
            <span className="text-slate-600 dark:text-slate-400">{new Date(result.paidAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
        <ShieldCheckIcon className="h-4 w-4 shrink-0" />
        <span>Your contribution directly powers 24/7 server hosting and emergency donor SMS alerts.</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/dashboard/support-us" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition">
          View Contribution History
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 transition">
          <HomeIcon className="h-3.5 w-3.5" /> Home
        </Link>
      </div>
    </div>
  );
}
