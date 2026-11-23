"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useDonorProfile } from "@/hooks/useDonor";
import { toast } from "sonner";
import {
  HeartHandshake,
  Droplet,
  Copy,
  Check,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface RequestRespondCtaProps {
  requestId: string;
}

export function RequestRespondCta({ requestId }: RequestRespondCtaProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { data: donorProfile } = useDonorProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const donorId = donorProfile?.id || (user as any)?.donorProfile?.id || user?.id || "";

  const handleCopyDonorId = () => {
    if (!donorId) return;
    navigator.clipboard.writeText(donorId);
    setCopied(true);
    toast.success("Donor ID copied to clipboard", {
      description: "Share this ID with the requester to record your donation.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  // Safe fallback while hydrating or for guests
  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-950/60 dark:bg-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Can you donate blood for this case?
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Sign in to coordinate directly with the patient family and record donations.
            </div>
          </div>
        </div>
        <Link
          href="/login"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
        >
          <Droplet className="h-3.5 w-3.5" /> Sign In to Respond
        </Link>
      </div>
    );
  }

  // 1. Logged in as DONOR
  if (user.role === "DONOR") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/20 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm mt-0.5">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Hospital Coordination Instructions
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
              Visit the hospital above to donate. Once completed, share your Donor Profile ID with the requester or hospital coordinator so they can log your donation for admin verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
          {donorId && (
            <button
              type="button"
              onClick={handleCopyDonorId}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm border border-emerald-200 hover:bg-emerald-50 dark:bg-slate-900 dark:border-emerald-800 dark:text-white transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  Copy Donor ID: <span className="font-mono text-emerald-700 dark:text-emerald-400">{donorId.slice(0, 8)}...</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/donor"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Manage Availability <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Logged in as ADMIN
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return (
      <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 dark:border-purple-950/60 dark:bg-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Administrator Controls
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Logged in as {user.name} (Admin). Moderate this request in the moderation queue.
            </div>
          </div>
        </div>
        <Link
          href="/admin/requests"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition"
        >
          Moderate in Admin <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // 3. Logged in as REQUESTER
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-950/60 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            Did a donor just donate blood for this case?
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Log the completed donation to submit it for administrative medical verification.
          </div>
        </div>
      </div>
      <Link
        href={`/requester/donations/log?requestId=${requestId}`}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
      >
        Record a Donation <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
