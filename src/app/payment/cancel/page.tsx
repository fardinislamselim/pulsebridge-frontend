import { Metadata } from "next";
import Link from "next/link";
import { XCircleIcon, RotateCcwIcon, HomeIcon, ShieldCheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Cancelled | PulseBridge",
  description: "Payment session cancelled. No charges were made to your account.",
};

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <XCircleIcon className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Payment Cancelled</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The transaction was cancelled or interrupted before completion.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-800/30 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 text-left">
          <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <p className="leading-relaxed">
            <strong>No Funds Deducted:</strong> No charges were made to your card or mobile wallet. You can retry your contribution whenever convenient.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/dashboard/support-us"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Try Payment Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 transition"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
