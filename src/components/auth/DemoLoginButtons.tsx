"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, type LoginPayload } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { Loader2, ArrowRightIcon, UserIcon, HeartIcon, ShieldAlertIcon } from "lucide-react";
import type { UserRole } from "@/types";

interface DemoAccountConfig {
  role: UserRole;
  label: string;
  roleBadge: string;
  email: string;
  password: string;
  redirectUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  borderClass: string;
  badgeClass: string;
}

const DEMO_ACCOUNTS: DemoAccountConfig[] = [
  {
    role: "REQUESTER",
    label: "Alice Rahman (Requester)",
    roleBadge: "Patient / Requester",
    email: "recipient.alice@pulsebridge.com",
    password: "DemoPassword123!",
    redirectUrl: "/requester",
    icon: UserIcon,
    borderClass: "hover:border-blue-500 hover:bg-blue-50/40 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  {
    role: "DONOR",
    label: "John Doe (Donor • O+)",
    roleBadge: "Voluntary Donor",
    email: "donor.john@pulsebridge.com",
    password: "DemoPassword123!",
    redirectUrl: "/donor",
    icon: HeartIcon,
    borderClass: "hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:border-emerald-900/60 dark:hover:bg-emerald-950/20",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  {
    role: "ADMIN",
    label: "PulseBridge Admin",
    roleBadge: "System Admin",
    email: "admin@pulsebridge.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "AdminPassword123!",
    redirectUrl: "/admin",
    icon: ShieldAlertIcon,
    borderClass: "hover:border-purple-500 hover:bg-purple-50/40 dark:hover:border-purple-900/60 dark:hover:bg-purple-950/20",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
];

export function DemoLoginButtons() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response, variables) => {
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Logged in as ${user.role} (${user.name})`);

      const matchingAccount = DEMO_ACCOUNTS.find((a) => a.email === variables.email);
      const target = matchingAccount?.redirectUrl || (user.role === "DONOR" ? "/donor" : user.role === "ADMIN" ? "/admin" : "/requester");

      router.push(target);
      router.refresh();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Demo login failed. Please verify seed credentials.";
      toast.error(msg);
      setActiveRole(null);
    },
  });

  const handleDemoClick = (account: DemoAccountConfig) => {
    setActiveRole(account.role);
    loginMutation.mutate({
      email: account.email,
      password: account.password,
    });
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Quick Demo Login (1-Click)
        </span>
        <span className="text-[10px] text-slate-400">Database Seeded</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {DEMO_ACCOUNTS.map((account) => {
          const isThisActive = isPending && activeRole === account.role;
          const Icon = account.icon;

          return (
            <button
              key={account.role}
              type="button"
              disabled={isPending}
              onClick={() => handleDemoClick(account)}
              className={`flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 text-left transition-all dark:border-slate-800 dark:bg-slate-900/60 ${account.borderClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
                  <Icon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {account.label}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${account.badgeClass}`}>
                      {account.roleBadge}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {account.email}
                  </div>
                </div>
              </div>

              <div>
                {isThisActive ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <ArrowRightIcon className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
