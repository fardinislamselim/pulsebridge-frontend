import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Heart, Clock, Award, Users, ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About PulseBridge | Mission, Safety Standards & Verification",
  description:
    "Learn how PulseBridge revolutionizes voluntary blood coordination through automated ABO/Rh matching, hospital verification, and mandatory 90-day medical cooldowns.",
};

export default function AboutPage() {
  const steps = [
    {
      step: "01",
      title: "Automated ABO/Rh Cross-Match",
      desc: "Our antigen matching engine cross-references donor red blood cell compatibility against recipient antibodies in milliseconds.",
      icon: Heart,
    },
    {
      step: "02",
      title: "Mandatory 90-Day Cooldown",
      desc: "To protect voluntary donors from iron deficiency and physical strain, donors are biologically locked for 90 days after each verified donation.",
      icon: Clock,
    },
    {
      step: "03",
      title: "Hospital Transfusion Verification",
      desc: "Donation records are matched with hospital blood bank receipts by authorized clinical coordinators before fulfillment credit is issued.",
      icon: Building2,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl space-y-16">
      {/* Mission Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/60">
          <ShieldCheck className="h-3.5 w-3.5" /> High-Trust Emergency Infrastructure
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Eliminating Blood Scarcity with Technology & Compassion
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          In emergency transfusion scenarios, minutes make the difference between life and death. PulseBridge was engineered to replace chaotic social media appeals with a verified, secure, and medically sound coordination pipeline.
        </p>
      </section>

      {/* Safety Standards Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
            The Three Pillars of Donor & Patient Safety
          </h2>
          <p className="text-xs text-slate-500 mt-1">Built to international WHO and Directorate General of Health Services (DGHS) guidelines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-3 relative overflow-hidden"
              >
                <div className="text-4xl font-extrabold text-slate-100 dark:text-slate-800 absolute right-4 top-2 pointer-events-none select-none">
                  {item.step}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy Callout & Bottom Action */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Privacy-First Volunteer Protection
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Donor contact details and personal identifiers are never publicly exposed to unauthorized callers or scrapers. Emergency dispatch only broadcasts to verified donors who opt in.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/register?role=DONOR"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            Become a Verified Donor <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
