import React from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/shared/Logo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Heart,
  Droplet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Register | PulseBridge Blood & Emergency Platform",
  description:
    "Join PulseBridge as a blood recipient or voluntary blood donor to connect with emergency networks and save lives.",
};

/**
 * RegisterPage - Pure Server Component (NO "use client")
 * Renders medical trust presentation layout and delegates interactive form to RegisterForm.
 */
export default function RegisterPage() {
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
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            Join the Life-Saving Network
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white leading-tight">
            Connect. Coordinate.
            <br />
            <span className="text-red-500">Save Lives</span> in Real Time.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Whether you are in urgent need of blood for a loved one or ready to volunteer as an active donor, PulseBridge bridges the gap with automated ABO/Rh matching and verified hospital coordination.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>90-Day Medical Cooldown Guards protect donors from over-donation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <Droplet className="h-4 w-4" />
              </div>
              <span>Algorithmic ABO & Rh antigen compatibility eliminates dangerous mismatches</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Activity className="h-4 w-4" />
              </div>
              <span>Instant hospital dispatch queue with live notification alerts</span>
            </div>
          </div>
        </div>

        {/* Footer Compliance Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>PulseBridge Healthcare Network v1.0</span>
          <span>WCAG 2.1 AA & 256-Bit SSL Secured</span>
        </div>
      </div>

      {/* Right Column: Registration Card housing the interactive Client Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Link (< lg screens) */}
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          {/* Interactive Form Component */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
