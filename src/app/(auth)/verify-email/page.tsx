import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/shared/Logo";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { ShieldCheck, Mail, Activity, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email | PulseBridge Blood & Emergency Platform",
  description:
    "Verify your email address with the 6-digit confirmation code to activate your PulseBridge account.",
};

/**
 * VerifyEmailPage - Pure Server Component (NO "use client")
 * Renders medical trust presentation layout and delegates OTP input to VerifyEmailForm.
 */
export default function VerifyEmailPage() {
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
            <Mail className="h-4 w-4 text-red-400" />
            Identity & Security Verification
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white leading-tight">
            Verified Donors.
            <br />
            <span className="text-red-500">Trusted</span> Network.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            PulseBridge mandates email and cryptographic identity verification for all accounts to prevent spoofing, maintain medical donor trust, and ensure prompt emergency notifications.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>Verified communications directly reach registered mobile & inbox</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <Activity className="h-4 w-4" />
              </div>
              <span>Anti-spoofing rate-limited OTP verification prevents automated bots</span>
            </div>
          </div>
        </div>

        {/* Footer Compliance Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>PulseBridge Healthcare Network v1.0</span>
          <span>WCAG 2.1 AA & 256-Bit SSL Secured</span>
        </div>
      </div>

      {/* Right Column: Verification Card housing the interactive Client Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Link (< lg screens) */}
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          {/* Interactive Form Component */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-3" />
                <span className="text-sm">Preparing email verification...</span>
              </div>
            }
          >
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
