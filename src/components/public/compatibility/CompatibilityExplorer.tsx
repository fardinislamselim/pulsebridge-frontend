"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  HeartHandshake,
  Search,
  BookOpen,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useBloodGroupCompatibility } from "@/hooks/useCompatibility";
import { BloodGroupSelector } from "./BloodGroupSelector";
import { CompatibilityBreakdownCard } from "./CompatibilityBreakdownCard";
import { PairwiseCompatibilityTester } from "./PairwiseCompatibilityTester";
import { CompatibilityMatrixTable } from "./CompatibilityMatrixTable";
import type { BloodGroup } from "@/types";

export function CompatibilityExplorer() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("O_NEGATIVE");
  const { canDonateTo, canReceiveFrom, isLoading } =
    useBloodGroupCompatibility(selectedGroup);

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 p-8 sm:p-10 text-white ">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Activity className="h-3.5 w-3.5" />
            <span>Clinical Hematology Rule Engine</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            ABO & Rh Blood Compatibility Engine
          </h1>
          <p className="text-sm sm:text-base text-red-100/90 leading-relaxed">
            Explore red blood cell compatibility across all 8 major blood groups.
            Simulate pairwise transfusions, discover universal donors, and understand
            antigen safety matching.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/donors"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              Find Compatible Donors
            </Link>
            <Link
              href="/blood-requests"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              View Urgent Requests
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Section 1: Interactive Group Selector & Breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            1. Blood Group Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Click any blood group to examine its complete transfusion compatibility profile
          </p>
        </div>

        <BloodGroupSelector
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
        />

        <CompatibilityBreakdownCard
          selectedGroup={selectedGroup}
          canDonateTo={canDonateTo}
          canReceiveFrom={canReceiveFrom}
          isLoading={isLoading}
        />
      </section>

      {/* Section 2: Pairwise Tester */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            2. Pairwise Match Simulator
          </h2>
          <p className="text-xs text-slate-500">
            Select specific donor and recipient pairs to evaluate clinical compatibility
          </p>
        </div>

        <PairwiseCompatibilityTester />
      </section>

      {/* Section 3: 8x8 Compatibility Matrix */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            3. Master Reference Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Complete 64-cell transfusion cross-reference chart for packed red blood cells
          </p>
        </div>

        <CompatibilityMatrixTable
          highlightGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />
      </section>

      {/* Section 4: Clinical Guidance & Educational FAQ */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="h-5 w-5 text-red-600" />
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
            Clinical Transfusion Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-950/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Crossmatching is Vital</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              While ABO and Rh(D) are primary factors, pre-transfusion laboratory crossmatching (mixing donor RBCs with recipient serum) is legally and clinically required to rule out minor antibody incompatibilities (Kell, Duffy, Kidd).
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-950/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Info className="h-4 w-4 text-blue-600" />
              <span>RBC vs Plasma Rules</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This chart covers Packed Red Blood Cells (PRBC). Plasma compatibility is the reverse: AB individuals are Universal Plasma Donors (no antibodies), while O individuals are Universal Plasma Recipients.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-950/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Activity className="h-4 w-4 text-amber-600" />
              <span>Rh Factor in Pregnancy</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Rh-negative women pregnant with Rh-positive fetuses require Rh immunoglobulin (RhoGAM) during and after delivery to prevent hemolytic disease of the newborn (HDN) in future pregnancies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
