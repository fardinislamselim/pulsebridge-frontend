"use client";

import React from "react";
import { useMyPayments } from "@/hooks/usePayments";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WalletIcon, LayersIcon } from "lucide-react";
import type { Payment } from "@/types";

export function MyPaymentsTable() {
  const { data: payments, isLoading } = useMyPayments();
  const paymentList = payments || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Your Contribution History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Records of your voluntary platform support transactions.
          </p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : paymentList.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={WalletIcon}
            title="No Contributions Yet"
            description="You haven't made any voluntary platform contributions yet. Thank you for supporting our mission!"
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paymentList.map((p: Payment) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {p.transactionId || p.id.slice(0, 10)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <LayersIcon className="h-3 w-3" />
                      {p.provider}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {p.currency} {p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {p.paymentPurpose?.replace("_", " ") || "Platform Support"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
