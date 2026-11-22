"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";

export function NavbarAuthActions() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      logout();
      toast.success("Signed out successfully", {
        description: "You have been logged out of your session.",
      });
      router.push("/login");
      router.refresh();
    }
  };

  // Graceful fallback during hydration: render standard accessible buttons
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </Link>
        <Link
          href="/register?role=DONOR"
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-700"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Join as Donor
        </Link>
      </div>
    );
  }

  if (isAuthenticated && user) {
    let dashboardPath = "/requester";
    if (user.role === "DONOR") dashboardPath = "/donor";
    else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      dashboardPath = "/admin";
    }

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <span className="max-w-[120px] truncate font-medium text-slate-700 dark:text-slate-300">
            {user.name || user.email}
          </span>
          <span className="rounded bg-slate-200 px-1 py-0.5 text-[9px] font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {user.role}
          </span>
        </div>

        {/* Role-Aware Dashboard Link */}
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <LogIn className="h-3.5 w-3.5" />
        Sign In
      </Link>
      <Link
        href="/register?role=DONOR"
        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Join as Donor
      </Link>
    </div>
  );
}
