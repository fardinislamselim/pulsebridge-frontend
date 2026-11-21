import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Activity,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | PulseBridge Blood & Emergency Platform",
  description:
    "Sign in to your PulseBridge account to manage blood requests, donor availability, and verified donations.",
};

/**
 * LoginPage - Pure Server Component (NO "use client")
 * Renders medical trust presentation layout and delegates interactive form to LoginForm.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left Column: Visual Medical Trust Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 p-12 text-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        {/* Central Graphic & Value Statements */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/60 px-4 py-1.5 text-xs font-medium text-red-300 backdrop-blur">
            <Activity className="h-4 w-4 text-red-400 animate-pulse" />
            High-Trust Medical Infrastructure
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white leading-tight">
            Rapid ABO/Rh Matching.
            <br />
            <span className="text-red-500">Zero Delays</span> in Critical Moments.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            PulseBridge empowers healthcare facilities, emergency responders, and voluntary blood donors to coordinate life-saving donations with full ABO/Rh compatibility and 90-day cooldown enforcement.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>End-to-end verified donor identity & medical cooldown checks</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <Activity className="h-4 w-4" />
              </div>
              <span>Real-time emergency dispatch queue with instant hospital coordination</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <UserCheck className="h-4 w-4" />
              </div>
              <span>Strict Role-Based Access Control (RBAC) across patient & donor portals</span>
            </div>
          </div>
        </div>

        {/* Footer Compliance Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>PulseBridge Healthcare System v1.0</span>
          <span>WCAG 2.1 AA & 256-Bit SSL Secured</span>
        </div>
      </div>

      {/* Right Column: Authentication Card housing the interactive Client Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Link (< lg screens) */}
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          {/* Interactive Form Component */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
