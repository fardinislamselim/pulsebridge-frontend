import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, Users, Navigation } from "lucide-react";
import { publicService } from "@/services/public.service";
import { DonorCard } from "@/components/public/DonorCard";
import { DonorFilterBar } from "@/components/public/DonorFilterBar";
import { UrlPagination } from "@/components/shared/UrlPagination";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BloodGroup, PublicDonor } from "@/types";

export const metadata: Metadata = {
  title: "Verified Donors Directory | PulseBridge",
  description:
    "Find voluntary, verified blood donors across Bangladesh with automated medical eligibility and GPS radius filtering.",
};

interface DonorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * DonorsPage - Pure Server Component (NO "use client")
 * URL-synchronized public donor directory supporting both district and GPS proximity queries.
 */
export default async function DonorsPage({ searchParams }: DonorsPageProps) {
  const params = await searchParams;

  const page = parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1;
  const limit = 12;
  const bloodGroup = typeof params.bloodGroup === "string" ? (params.bloodGroup as BloodGroup) : undefined;
  const district = typeof params.district === "string" ? params.district : undefined;
  const isAvailable = params.isAvailable === "true" ? true : undefined;

  const latStr = typeof params.latitude === "string" ? params.latitude : undefined;
  const lngStr = typeof params.longitude === "string" ? params.longitude : undefined;
  const hasGps = Boolean(latStr && lngStr && !isNaN(parseFloat(latStr)) && !isNaN(parseFloat(lngStr)));

  let donors: PublicDonor[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    if (hasGps) {
      const latitude = parseFloat(latStr!);
      const longitude = parseFloat(lngStr!);
      const radiusKm = typeof params.radiusKm === "string" ? parseFloat(params.radiusKm) : 15;
      const res = await publicService.getNearbyDonors({ latitude, longitude, radiusKm, bloodGroup, limit });
      donors = res.data || [];
      total = res.meta?.total ?? donors.length;
      totalPages = res.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
    } else {
      const res = await publicService.getPublicDonors({ page, limit, bloodGroup, district, isAvailable });
      donors = res.data || [];
      total = res.meta?.total ?? donors.length;
      totalPages = res.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
    }
  } catch {
    donors = [];
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" />
            <span>Voluntary Donor Community</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find Blood Donors
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Connect with verified voluntary donors maintaining safe medical donation intervals.
          </p>
        </div>

        <Link
          href="/register?role=DONOR"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          Join as Donor
        </Link>
      </div>

      {/* GPS Active Alert Banner */}
      {hasGps && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-red-600 shrink-0" />
            <span>Showing verified donors within a <strong>15 km</strong> radius of your current GPS location.</span>
          </div>
          <Link href="/donors" className="font-bold underline hover:no-underline shrink-0">Clear GPS</Link>
        </div>
      )}

      {/* Filter Bar */}
      <DonorFilterBar />

      {/* Donors Grid */}
      {donors.length === 0 ? (
        <EmptyState
          title="No Matching Donors Found"
          description="We couldn't find any verified voluntary donors matching your exact filter criteria. Try expanding your location or clearing filters."
          actionLabel="Register as a Donor"
          actionHref="/register?role=DONOR"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>

          <UrlPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
          />
        </div>
      )}
    </div>
  );
}
