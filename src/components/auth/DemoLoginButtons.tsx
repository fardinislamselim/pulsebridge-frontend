"use client";

import React from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

export interface DemoAccount {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  description: string;
  badgeColor: string;
  borderHover: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "REQUESTER",
    title: "Requester Portal",
    name: "Alice Rahman",
    email: "recipient.alice@pulsebridge.com",
    password: "DemoPassword123!",
    badge: "Requester",
    description: "Create requests, find matching donors & log donations",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
    borderHover: "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
  },
  {
    role: "DONOR",
    title: "Donor Portal",
    name: "Bob Hasan",
    email: "donor.bob@pulsebridge.com",
    password: "DemoPassword123!",
    badge: "Donor (O+)",
    description: "Accept emergency requests, track donations & eligibility",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    borderHover: "hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
  },
  {
    role: "ADMIN",
    title: "Admin Command",
    name: "Dr. Sarah Khan",
    email: "admin.sarah@pulsebridge.com",
    password: "DemoPassword123!",
    badge: "Staff Admin",
    description: "Verify donations, hospital dispatch & system metrics",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    borderHover: "hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
  },
];

interface DemoLoginButtonsProps {
  onSelectAccount: (account: DemoAccount) => void;
  isLoading: boolean;
  selectedEmail?: string;
}

export function DemoLoginButtons({
  onSelectAccount,
  isLoading,
  selectedEmail,
}: DemoLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        Select a verified demo persona for instant access:
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {DEMO_ACCOUNTS.map((account) => {
          const isThisSelected = isLoading && selectedEmail === account.email;

          return (
            <button
              key={account.role}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectAccount(account)}
              className={`group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-left transition-all dark:border-slate-800 dark:bg-slate-900/60 ${account.borderHover} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${account.badgeColor}`}
                  >
                    {account.badge}
                  </span>
                  {isThisSelected ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                  )}
                </div>

                <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                  {account.title}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {account.name}
                </div>
              </div>

              <div className="mt-2.5 text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {account.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
