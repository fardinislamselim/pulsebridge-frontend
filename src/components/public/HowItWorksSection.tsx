import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, FileCheck2, Clock, Users, ArrowUpRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Verified Emergency Appeal",
      subtitle: "Patient & Hospital Intake",
      description:
        "A patient, attendant, or hospital coordinator submits an emergency blood request with hospital admission details and unit requirements. PulseBridge verifies admission validity to prevent fraud.",
      icon: FileCheck2,
      badge: "Intake & Triage",
      badgeClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900",
      iconClass: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/70",
    },
    {
      step: "02",
      title: "ABO/Rh Antigen Matching",
      subtitle: "Autonomous Compatibility Engine",
      description:
        "Our engine tests reciprocal red cell compatibility across 8 blood groups and matches nearby voluntary donors located outside their mandatory 90-day medical cooldown window.",
      icon: HeartHandshake,
      badge: "Rapid Dispatch",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
      iconClass: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/70",
    },
    {
      step: "03",
      title: "Transfusion & Cooldown Lock",
      subtitle: "Verified Donation & Health Safety",
      description:
        "Following hospital donation, the transaction is verified by the coordinator or admin. The fulfilled units decrement immediately, and the donor's 90-day biological recovery lock activates automatically.",
      icon: ShieldCheck,
      badge: "Medical Safety",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
      iconClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70",
    },
  ];

  return (
    <section className="container mx-auto px-4 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 mb-2">
            Clinical Protocol
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How PulseBridge Coordinates Life-Saving Blood
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mt-1">
            From hospital emergency admission to verified transfusion, our clinical workflow operates with zero delays and strict donor health safeguards.
          </p>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition shrink-0"
        >
          Explore Protocol Details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-200 dark:text-slate-800">
                    {item.step}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Step {item.step} of 03</span>
                <Clock className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
