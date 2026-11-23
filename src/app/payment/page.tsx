import { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Methods & Gateways | PulseBridge",
  description: "Supported voluntary contribution gateways including SSLCOMMERZ (BDT) and Stripe (USD).",
};

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white ">
            <CreditCard className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-white">
            Support PulseBridge
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Voluntary platform support for blood cold-chain logistics and emergency dispatch infrastructure.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-slate-200 p-4 transition hover:border-red-500 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold dark:bg-emerald-950/60 dark:text-emerald-300">
                  SSL
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    SSLCommerz (Local BDT)
                  </div>
                  <div className="text-xs text-slate-500">
                    bKash, Nagad, Rocket, Cards & Local Net Banking
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">BDT</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 transition hover:border-red-500 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300">
                  STR
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Stripe (International USD)
                  </div>
                  <div className="text-xs text-slate-500">
                    Visa, Mastercard, American Express & Digital Wallets
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600">USD</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>All transactions are 256-bit SSL encrypted and idempotent.</span>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ← Return to PulseBridge Home
          </Link>
        </div>
      </div>
    </div>
  );
}
