import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Droplet, ShieldCheck, HeartPulse } from "lucide-react";
import { publicService } from "@/services/public.service";
import { BloodRequestCard } from "@/components/public/BloodRequestCard";
import { HeroSection } from "@/components/public/HeroSection";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { FeaturedDonorsSection } from "@/components/public/FeaturedDonorsSection";
import { EligibilityFaqSection } from "@/components/public/EligibilityFaqSection";
import { QuickCompatibilityWidget } from "@/components/public/QuickCompatibilityWidget";
import { StatCard } from "@/components/shared/StatCard";
import type { BloodRequest, PublicDonor } from "@/types";

export const metadata: Metadata = {
  title: "PulseBridge | Emergency Blood Donation & Rapid Coordination Platform",
  description:
    "Instant ABO/Rh compatible donor matching, 90-day medical cooldown protection, and hospital emergency dispatch across Bangladesh.",
};

/**
 * PulseBridge Homepage - Pure Server Component (NO "use client")
 * Renders hero, clinical pillars, urgent appeals feed, workflow breakdown, featured donors, and eligibility FAQ.
 */
export default async function HomePage() {
  let urgentRequests: BloodRequest[] = [];
  let featuredDonors: PublicDonor[] = [];
  let isSystemActive = true;

  try {
    const [requestsRes, donorsRes, healthRes] = await Promise.all([
      publicService.getPublicBloodRequests({ limit: 6, urgency: "EMERGENCY" }),
      publicService.getPublicDonors({ limit: 4, isAvailable: true }),
      publicService.getSystemHealth().catch(() => null),
    ]);
    urgentRequests = requestsRes.data || [];
    featuredDonors = donorsRes.data || [];
    isSystemActive = healthRes?.success ?? true;
  } catch {
    urgentRequests = [];
    featuredDonors = [];
  }

  return (
    <div className="flex flex-col space-y-16 sm:space-y-20 py-8 sm:py-12">
      {/* 1. Hero Presentation */}
      <HeroSection isSystemActive={isSystemActive} />

      {/* 2. Platform Clinical Pillars */}
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

      {/* 3. Section A: How PulseBridge Works */}
      <HowItWorksSection />

      {/* 4. Live Emergency Requests Feed */}
      {urgentRequests.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 mb-2">
                Emergency Feed
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Urgent Blood Appeals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Active emergency transfusion cases requiring immediate compatible responder response
              </p>
            </div>
            <Link
              href="/blood-requests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition shrink-0"
            >
              View All Directory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {urgentRequests.map((req) => (
              <BloodRequestCard key={req.id} request={req} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Section B: Verified Voluntary Donors Spotlight */}
      <FeaturedDonorsSection donors={featuredDonors} />

      {/* 6. Interactive Compatibility Checker Widget */}
      <section className="container mx-auto px-4 max-w-4xl">
        <QuickCompatibilityWidget />
      </section>

      {/* 7. Section C: Clinical Safety & Eligibility FAQ */}
      <EligibilityFaqSection />
    </div>
  );
}
