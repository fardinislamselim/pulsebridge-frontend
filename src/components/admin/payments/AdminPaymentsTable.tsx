"use client";

import React, { useState } from "react";
import { useAdminPayments } from "@/hooks/useAdminGovernance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RefundPaymentDialog } from "./RefundPaymentDialog";
import { CreditCardIcon, RotateCcwIcon, LayersIcon } from "lucide-react";
import type { Payment, PaymentProvider } from "@/types";

export function AdminPaymentsTable() {
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<Payment | null>(null);

  const { data: payments, isLoading } = useAdminPayments({
    ...(providerFilter !== "ALL" ? { provider: providerFilter } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
  });

  const paymentList = payments || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Payment Ledger & Gateway Transactions
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Gateways</option>
            <option value="SSLCOMMERZ">SSLCOMMERZ</option>
            <option value="STRIPE">STRIPE</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="PARTIALLY_REFUNDED">PARTIALLY REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} columns={6} />
          </div>
        ) : paymentList.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={CreditCardIcon}
              title="No Payments Found"
              description="No transaction records match the specified filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Gateway</th>
                  <th className="px-5 py-3.5">Amount & Currency</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paymentList.map((payment: Payment) => {
                  const refunded = (payment as any).refundAmount ?? payment.refundedAmount ?? 0;
                  const isEligibleForRefund =
                    payment.status === "SUCCESS" && refunded < payment.amount;

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {payment.transactionId || payment.id.slice(0, 12)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {payment.user?.name || "Anonymous User"}
                        </div>
                        <div className="text-xs text-slate-400">{payment.user?.email || "—"}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <LayersIcon className="h-3 w-3" />
                          {payment.provider}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </div>
                        {refunded > 0 && (
                          <div className="text-[11px] text-amber-600 dark:text-amber-400">
                            Refunded: {payment.currency} {refunded.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedPaymentForRefund(payment)}
                          disabled={!isEligibleForRefund}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <RotateCcwIcon className="h-3.5 w-3.5" /> Refund
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RefundPaymentDialog
        payment={selectedPaymentForRefund}
        open={Boolean(selectedPaymentForRefund)}
        onOpenChange={(open) => !open && setSelectedPaymentForRefund(null)}
      />
    </div>
  );
}
