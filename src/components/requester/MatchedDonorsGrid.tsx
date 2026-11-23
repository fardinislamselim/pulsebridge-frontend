import React from "react";
import { Users, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";
import { DonorCard } from "@/components/public/DonorCard";
import { CardGridSkeleton } from "@/components/shared/CardGridSkeleton";
import type { MatchedEligibleDonor } from "@/types";

interface MatchedDonorsGridProps {
  donors: MatchedEligibleDonor[];
  isLoading: boolean;
  requestId: string;
  district: string;
}

export function MatchedDonorsGrid({
  donors,
  isLoading,
  requestId,
  district,
}: MatchedDonorsGridProps) {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Request link copied to clipboard!");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Matched Eligible Donors
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {donors.length} Found
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated ABO/Rh compatible donors within proximity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Auto-Matched by System
        </div>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={4} columns={2} />
      ) : donors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <Users className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Searching for Compatible Donors
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Our matching engine is actively scanning verified donors in {district} with compatible blood.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Share2 className="h-3.5 w-3.5" />
              Broadcast Public Appeal
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {donors.map((donor) => (
            <DonorCard key={donor.donorId} donor={donor} requestId={requestId} />
          ))}
        </div>
      )}
    </div>
  );
}
