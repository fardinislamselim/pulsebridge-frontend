"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributionSchema, type ContributionFormData } from "@/schemas/payment.schema";
import { useInitiatePayment } from "@/hooks/usePayments";
import { HeartHandshakeIcon, ShieldCheckIcon, CreditCardIcon, Loader2 } from "lucide-react";

const PRESETS = {
  BDT: [500, 1000, 2000, 5000],
  USD: [10, 25, 50, 100],
};

export function VoluntaryContributionForm() {
  const [selectedGateway, setSelectedGateway] = useState<"SSLCOMMERZ" | "STRIPE">("SSLCOMMERZ");
  const initiateMutation = useInitiatePayment();
  const currentCurrency = selectedGateway === "SSLCOMMERZ" ? "BDT" : "USD";
  const presets = PRESETS[currentCurrency];

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: presets[1],
      provider: "SSLCOMMERZ",
      currency: "BDT",
      paymentPurpose: "PLATFORM_SUPPORT",
      description: "",
    },
  });

  const amountValue = watch("amount");

  const handleGatewayChange = (gateway: "SSLCOMMERZ" | "STRIPE") => {
    setSelectedGateway(gateway);
    const curr = gateway === "SSLCOMMERZ" ? "BDT" : "USD";
    setValue("provider", gateway);
    setValue("currency", curr);
    setValue("amount", PRESETS[curr][1]);
  };

  const onSubmit = (data: ContributionFormData) => {
    initiateMutation.mutate({
      amount: data.amount,
      provider: data.provider,
      currency: data.currency,
      paymentPurpose: data.paymentPurpose,
      description: data.description || "Voluntary Platform Support Contribution",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <HeartHandshakeIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Support PulseBridge Platform</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Keep emergency matching & coordination operational 24/7.</p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-start gap-2.5">
        <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>100% Free Guarantee:</strong> Blood requests & donor matching are always completely free. Contributions are strictly voluntary.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">Select Gateway</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleGatewayChange("SSLCOMMERZ")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedGateway === "SSLCOMMERZ" ? "border-red-600 bg-red-50/40 dark:border-red-500 dark:bg-red-950/30 ring-2 ring-red-600/20" : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">SSLCommerz</div>
              <div className="text-[11px] text-slate-500">bKash, Nagad • BDT</div>
            </button>
            <button
              type="button"
              onClick={() => handleGatewayChange("STRIPE")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedGateway === "STRIPE" ? "border-red-600 bg-red-50/40 dark:border-red-500 dark:bg-red-950/30 ring-2 ring-red-600/20" : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">Stripe</div>
              <div className="text-[11px] text-slate-500">Global Cards • USD</div>
            </button>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">Amount ({currentCurrency})</label>
          <div className="grid grid-cols-4 gap-1.5 mb-2.5">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setValue("amount", val, { shouldValidate: true })}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  amountValue === val ? "bg-red-600 text-white shadow-sm" : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {currentCurrency === "BDT" ? `৳${val}` : `$${val}`}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-2.5 font-bold text-slate-400">{currentCurrency === "BDT" ? "৳" : "$"}</span>
            <input
              type="number"
              step="any"
              {...register("amount")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm font-semibold text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
          {errors.amount && <p className="mt-1 text-red-500">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Optional Note / Dedication</label>
          <input
            type="text"
            placeholder="In honor of voluntary donors..."
            {...register("description")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={initiateMutation.isPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition disabled:opacity-50"
        >
          {initiateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Initiating Session...
            </>
          ) : (
            <>
              <CreditCardIcon className="h-4 w-4" />
              Contribute {currentCurrency === "BDT" ? "৳" : "$"}{amountValue || 0} via {selectedGateway}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
