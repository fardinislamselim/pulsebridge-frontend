import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, AlertCircle, HeartPulse, Scale, Activity, ArrowRight } from "lucide-react";
import { FaqAccordion } from "./FaqAccordion";

export function EligibilityFaqSection() {
  const criteria = [
    { label: "Age Requirement", detail: "18 – 60 Years Old", icon: Activity },
    { label: "Minimum Body Weight", detail: "50 kg (110 lbs) or above", icon: Scale },
    { label: "Minimum Hemoglobin", detail: "≥ 12.5 g/dL (Females) / ≥ 13.0 g/dL (Males)", icon: HeartPulse },
    { label: "Medical Cooldown Interval", detail: "Strict 90 Days between whole blood donations", icon: ShieldCheck },
    { label: "Blood Pressure Range", detail: "100–140 mmHg systolic / 60–90 mmHg diastolic", icon: Activity },
    { label: "Pulse & Temperature", detail: "60–100 bpm regular, oral temp ≤ 37.5°C (99.5°F)", icon: Activity },
  ];

  return (
    <section className="container mx-auto px-4 max-w-6xl space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900 mb-2">
          Safety Protocols
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Clinical Safety & Donor Eligibility Standards
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          World Health Organization (WHO) and National Blood Transfusion Service safety guidelines strictly observed across the PulseBridge network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: WHO Donor Eligibility Guidelines Card (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                WHO Clinical Criteria
              </h3>
              <p className="text-xs text-slate-500">Prerequisites for voluntary blood donation</p>
            </div>
          </div>

          <div className="space-y-3">
            {criteria.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 text-xs"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              Temporary Deferrals
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Postpone donation if you have had antibiotics within 7 days, dental extraction in 3 days, recent tattoos in 6 months, or COVID-19/fever symptoms in 14 days.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/register?role=DONOR"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              Register as Voluntary Donor <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Interactive FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <span className="text-xs text-slate-400">Click to expand questions</span>
          </div>

          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
