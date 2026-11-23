import React from "react";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

interface HeroSectionProps {
  isSystemActive?: boolean;
}

/**
 * HeroSection - Pure Server Component
 * Renders main headline and primary calls-to-action for blood requests and donor registration.
 */
export function HeroSection({ isSystemActive = true }: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 text-center max-w-4xl space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        <Activity className="h-3.5 w-3.5 text-red-600 animate-pulse" />
        <span>{isSystemActive ? "24/7 Emergency Dispatch Active" : "Automated Transfusion Network"}</span>
      </div>

      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Every drop counts. <span className="text-red-600">Every second matters.</span>
      </h1>

      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        PulseBridge bridges blood recipients, voluntary donors, and hospital transfusion centers with automated ABO/Rh matching, medical cooldown safety guards, and immediate distress broadcasts.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/requester/requests/new"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
        >
          Request Blood Now <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/register?role=DONOR"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition"
        >
          Join as Blood Donor
        </Link>
      </div>
    </section>
  );
}
