import { Metadata } from "next";
import { PaymentStatsGrid } from "@/components/admin/payments/PaymentStatsGrid";
import { AdminPaymentsTable } from "@/components/admin/payments/AdminPaymentsTable";

export const metadata: Metadata = {
  title: "Payment Ledger & Refunds | PulseBridge Admin",
  description: "Gateway financial reconciliation, multi-currency revenue analytics, and transaction refund controls.",
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Payment Ledger & Refund Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Financial reconciliation across SSLCOMMERZ and Stripe payment gateways with transaction-level refund controls.
        </p>
      </div>

      <PaymentStatsGrid />

      <AdminPaymentsTable />
    </div>
  );
}
