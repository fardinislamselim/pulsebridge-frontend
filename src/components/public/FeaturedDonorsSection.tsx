import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle2, ShieldCheck, Heart, User } from "lucide-react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { PublicDonor } from "@/types";

interface FeaturedDonorsSectionProps {
  donors: PublicDonor[];
}

export function FeaturedDonorsSection({ donors }: FeaturedDonorsSectionProps) {
  if (!donors || donors.length === 0) return null;

  return (
    <section className="container mx-auto px-4 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900 mb-2">
            Active Heroes
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified Voluntary Donors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Voluntary heroes ready to respond to emergency hospital appeals across Bangladesh
          </p>
        </div>

        <Link
          href="/donors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition shrink-0"
        >
          View Full Directory <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {donors.map((donor) => {
          const location = [donor.area, donor.city || donor.district].filter(Boolean).join(", ");
          return (
            <div
              key={donor.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <User className="h-5 w-5" />
                  </div>
                  {donor.bloodGroup && (
                    <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white truncate">
                    <span>{donor.user?.name || "Anonymous Hero"}</span>
                    {donor.isVerified && (
                      <span title="Verified Voluntary Donor">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                    <span>{location || "Bangladesh"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      donor.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      donor.isAvailable
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {donor.isAvailable ? "Available Today" : "In 90-Day Cooldown"}
                  </span>
                </div>

                <Link
                  href={`/donors?bloodGroup=${donor.bloodGroup || ""}`}
                  className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Connect via Blood Request"
                >
                  <Heart className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
