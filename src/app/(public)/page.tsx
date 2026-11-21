import Link from "next/link";
import {
  Heart,
  Activity,
  ShieldCheck,
  ArrowRight,
  Droplet,
  Users,
  Compass,
  AlertCircle,
} from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { BloodGroup } from "@/types";

const FEATURED_GROUPS: BloodGroup[] = [
  "O_NEGATIVE",
  "O_POSITIVE",
  "A_POSITIVE",
  "B_POSITIVE",
  "AB_POSITIVE",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <Activity className="h-3.5 w-3.5 text-red-600 animate-pulse" />
            Real-time ABO/Rh Automated Matching System
          </div>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
            Every drop counts.{" "}
            <span className="text-red-600">Every second matters.</span>
          </h1>

          <p className="mt-5 text-base text-slate-600 sm:text-lg dark:text-slate-300 leading-relaxed">
            PulseBridge connects blood recipients, voluntary donors, and hospitals with verified ABO/Rh compatibility, 90-day medical cooldown guards, and instant emergency response.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/requester/requests/new"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Request Blood Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=DONOR"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Register as Blood Donor
            </Link>
          </div>
        </div>

        {/* Live ABO Preview Pills */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Critical Blood Groups in High Demand
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {FEATURED_GROUPS.map((group) => (
              <div key={group} className="flex items-center gap-2 rounded-xl bg-white p-1.5 pr-3 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <BloodGroupBadge bloodGroup={group} size="sm" />
                <StatusBadge status="EMERGENCY" size="sm" showIcon={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60">
                <Droplet className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  8 Groups
                </div>
                <div className="text-xs font-medium text-slate-500">
                  ABO & Rh Antigen Engine
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  90-Day Cooldown
                </div>
                <div className="text-xs font-medium text-slate-500">
                  Medical Donor Protection
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  24/7 Verified
                </div>
                <div className="text-xs font-medium text-slate-500">
                  Emergency Dispatch Queue
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
