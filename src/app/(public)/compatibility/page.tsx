import React from "react";
import type { Metadata } from "next";
import { CompatibilityExplorer } from "@/components/public/compatibility/CompatibilityExplorer";

export const metadata: Metadata = {
  title: "Blood Compatibility Chart & ABO/Rh Checker | PulseBridge",
  description:
    "Interactive ABO and Rh blood group compatibility engine. Discover universal donors, test pairwise packed red blood cell matching, and review the clinical 8x8 matrix.",
};

/**
 * CompatibilityPage - Pure Server Component (NO "use client")
 * Serves the interactive ABO/Rh Blood Compatibility Explorer.
 */
export default function CompatibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <CompatibilityExplorer />
    </div>
  );
}
