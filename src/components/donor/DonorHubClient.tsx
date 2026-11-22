"use client";

import React from "react";
import { useDonorProfile, useDonorEligibility, useMyDonations } from "@/hooks/useDonor";
import { DonorStatsGrid } from "./DonorStatsGrid";
import { CooldownStatusCard } from "./CooldownStatusCard";
import { AvailabilityToggleCard } from "./AvailabilityToggleCard";
import { RecentDonationsPreview } from "./RecentDonationsPreview";

export function DonorHubClient() {
  const { data: profile, isLoading: isProfileLoading } = useDonorProfile();
  const { data: eligibility, isLoading: isEligibilityLoading } = useDonorEligibility();
  const { data: donationHistory, isLoading: isDonationsLoading } = useMyDonations({ limit: 5 });

  const summary = donationHistory?.summary;
  const donations = donationHistory?.donations || [];

  return (
    <div className="space-y-6">
      {/* 4 KPI Summary Cards */}
      <DonorStatsGrid
        profile={profile}
        eligibility={eligibility}
        summary={summary}
        isLoading={isProfileLoading || isEligibilityLoading}
      />

      {/* 2-Column Cooldown & Availability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CooldownStatusCard
          eligibility={eligibility}
          isLoading={isEligibilityLoading}
        />

        <AvailabilityToggleCard
          profile={profile}
          eligibility={eligibility}
          isLoading={isProfileLoading || isEligibilityLoading}
        />
      </div>

      {/* Recent Donations Table */}
      <RecentDonationsPreview
        donations={donations}
        isLoading={isDonationsLoading}
      />
    </div>
  );
}
