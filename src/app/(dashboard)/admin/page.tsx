import React from "react";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Command Center & Operations Dashboard | PulseBridge",
  description:
    "Real-time administrative command center for emergency blood matching, donor verification, request approvals, and platform growth analytics.",
};

/**
 * AdminDashboardPage - Pure Server Component (NO "use client")
 * Serves the primary system operations and analytics dashboard for Administrators.
 */
export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="h-4 w-4" />
          <span>Platform Command Center</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          System Administration & Governance
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Monitor life-critical matching queues, donor compliance, request triage, and clinical transaction telemetry.
        </p>
      </div>

      {/* Interactive Admin Client */}
      <AdminDashboardClient />
    </div>
  );
}
