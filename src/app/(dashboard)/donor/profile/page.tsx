import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, UserCircle } from "lucide-react";
import { DonorProfileForm } from "@/components/donor/DonorProfileForm";

export const metadata: Metadata = {
  title: "Donor Profile Settings | PulseBridge",
  description:
    "Update your voluntary blood donor profile, ABO/Rh blood group, and residential district for emergency hospital transfusions.",
};

/**
 * DonorProfilePage - Pure Server Component (NO "use client")
 * Serves the Donor Profile & Demographics Editor.
 */
export default function DonorProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <Link
            href="/donor"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Donor Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-red-600" />
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Edit Donor Profile
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Keep your blood type and contact details up-to-date so patients and hospital staff can connect in life-or-death situations.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <DonorProfileForm />
    </div>
  );
}
