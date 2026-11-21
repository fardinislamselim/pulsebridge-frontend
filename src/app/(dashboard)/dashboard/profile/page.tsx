import React from "react";
import type { Metadata } from "next";
import { ProfileUpdateForm } from "@/components/profile/ProfileUpdateForm";
import { ActiveSessionsList } from "@/components/profile/ActiveSessionsList";
import { Shield, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Settings & Sessions | PulseBridge",
  description:
    "Manage your personal profile, contact information, and active security sessions.",
};

/**
 * ProfilePage - Pure Server Component (NO "use client")
 * Composes ProfileUpdateForm and ActiveSessionsList inside the dashboard layout.
 */
export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Profile & Security
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal identity, contact details, and review active authorized device sessions.
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8">
        {/* Personal Profile Details */}
        <section aria-labelledby="profile-settings-heading">
          <ProfileUpdateForm />
        </section>

        {/* Active Authorized Sessions */}
        <section aria-labelledby="active-sessions-heading">
          <ActiveSessionsList />
        </section>
      </div>
    </div>
  );
}
