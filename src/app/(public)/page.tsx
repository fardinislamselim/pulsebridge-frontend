import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, Droplet, ShieldCheck, HeartPulse } from "lucide-react";
import { publicService } from "@/services/public.service";
import { BloodRequestCard } from "@/components/public/BloodRequestCard";
import { QuickCompatibilityWidget } from "@/components/public/QuickCompatibilityWidget";
import { StatCard } from "@/components/shared/StatCard";
import type { BloodRequest } from "@/types";

export const metadata: Metadata = {
  title: "PulseBridge | Emergency Blood Donation & Rapid Coordination Platform",
  description:
    "Instant ABO/Rh compatible donor matching, 90-day medical cooldown protection, and hospital emergency dispatch across Bangladesh.",
};

export default async function HomePage() {
  let urgentRequests: BloodRequest[] = [];
  let isSystemActive = true;

  try {
    const [requestsRes, healthRes] = await Promise.all([
      publicService.getPublicBloodRequests({ limit: 6, urgency: "EMERGENCY" }),
      publicService.getSystemHealth().catch(() => null),
    ]);
    urgentRequests = requestsRes.data || [];
    isSystemActive = healthRes?.success ?? true;
  } catch {
    urgentRequests = [];
  }

  return (
    <div className="flex flex-col space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
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

      {/* Platform Pillars */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Antigen Engine"
            value="8 Groups"
            subtitle="Full ABO & Rh Automated Matching"
            icon={Droplet}
            iconBgClass="bg-red-100 text-red-600 dark:bg-red-950/60"
          />
          <StatCard
            title="Donor Protection"
            value="90-Day Lock"
            subtitle="Enforced Medical Cooldown Safeguard"
            icon={ShieldCheck}
            iconBgClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60"
            iconColorClass="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            title="Hospital Dispatch"
            value="Direct SMS"
            subtitle="Sub-minute Broadcast to Local Donors"
            icon={HeartPulse}
            iconBgClass="bg-blue-100 text-blue-600 dark:bg-blue-950/60"
            iconColorClass="text-blue-600 dark:text-blue-400"
          />
        </div>
      </section>

      {/* Live Emergency Requests Feed */}
      {urgentRequests.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Urgent Blood Appeals
              </h2>
              <p className="text-xs text-slate-500">Active emergency transfusion cases requiring immediate response</p>
            </div>
            <Link href="/blood-requests" className="text-xs font-semibold text-red-600 hover:underline">
              View All Directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {urgentRequests.map((req) => (
              <BloodRequestCard key={req.id} request={req} />
            ))}
          </div>
        </section>
      )}

      {/* Interactive Compatibility Widget */}
      <section className="container mx-auto px-4 max-w-4xl">
        <QuickCompatibilityWidget />
      </section>
    </div>
  );
}
