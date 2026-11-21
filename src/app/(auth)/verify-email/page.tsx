import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/shared/Logo";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email | PulseBridge Blood & Emergency Platform",
  description:
    "Verify your email address with the 6-digit confirmation code to activate your PulseBridge account.",
};

/**
 * VerifyEmailPage - Pure Server Component (NO "use client")
 * Renders medical card layout wrapping VerifyEmailForm with a Suspense boundary.
 */
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center mb-2">
          <Logo size="md" />
        </div>

        {/* Verification Card with Suspense Fallback */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
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

        {/* Trust & Security Note */}
        <div className="text-center text-xs text-slate-400">
          PulseBridge Security • One-Time Password Verification • 256-Bit SSL
        </div>
      </div>
    </div>
  );
}
