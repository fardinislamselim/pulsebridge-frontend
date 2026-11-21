"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import {
  Menu,
  Heart,
  Droplet,
  Users,
  Grid,
  Info,
  PhoneCall,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
} from "lucide-react";

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PUBLIC_LINKS: NavLinkItem[] = [
  { href: "/", label: "Home", icon: Heart },
  { href: "/blood-requests", label: "Blood Requests", icon: Droplet },
  { href: "/donors", label: "Find Donors", icon: Users },
  { href: "/compatibility", label: "Compatibility Matrix", icon: Grid },
  { href: "/about", label: "About & Safety", icon: Info },
  { href: "/contact", label: "Helpline & Contact", icon: PhoneCall },
];

export function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      logout();
      setOpen(false);
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/requester";
    if (user.role === "DONOR") return "/donor";
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return "/admin";
    return "/requester";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        aria-label="Open Navigation Menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-xs p-6 flex flex-col justify-between">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="space-y-6">
          {/* Brand Logo */}
          <div onClick={() => setOpen(false)}>
            <Logo size="md" />
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-1">
            {PUBLIC_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Auth Actions & Emergency Callout */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          {mounted && isAuthenticated && user ? (
            <div className="space-y-2.5">
              <div className="rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {user.name || user.email}
                </div>
                <div className="text-slate-500 text-[11px] uppercase tracking-wider">
                  Role: {user.role}
                </div>
              </div>

              <Link
                href={getDashboardPath()}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/30"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                href="/register?role=DONOR"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Join
              </Link>
            </div>
          )}

          {/* 24/7 Helpline Banner */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              Emergency Helpline
            </div>
            <p className="mt-1 text-[11px] leading-tight">
              Direct dispatch: <strong className="font-mono">16263</strong> /{" "}
              <strong className="font-mono">+880 9612-000000</strong>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
