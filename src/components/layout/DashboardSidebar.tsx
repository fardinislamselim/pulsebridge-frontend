"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  CheckSquare,
  UserCheck,
  History,
  BarChart3,
  AlertCircle,
  HeartHandshake,
  Users,
  CreditCard,
  Shield,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Droplet,
} from "lucide-react";

interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Determine role-specific primary links
  const getRoleNavItems = (): SidebarNavItem[] => {
    const role = user?.role;

    if (role === "REQUESTER") {
      return [
        {
          href: "/requester",
          label: "Dashboard Overview",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: "/requester/requests/new",
          label: "New Blood Request",
          icon: PlusCircle,
        },
        {
          href: "/requester/requests",
          label: "My Blood Requests",
          icon: ClipboardList,
        },
        {
          href: "/requester/donations/log",
          label: "Log Received Donation",
          icon: CheckSquare,
        },
      ];
    }

    if (role === "DONOR") {
      return [
        {
          href: "/donor",
          label: "Donor Hub",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: "/donor/profile",
          label: "Donor Profile & Medical",
          icon: UserCheck,
        },
        {
          href: "/donor/history",
          label: "Donation History",
          icon: History,
        },
      ];
    }

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return [
        {
          href: "/admin",
          label: "Analytics & Overview",
          icon: BarChart3,
          exact: true,
        },
        {
          href: "/admin/requests",
          label: "Request Moderation",
          icon: AlertCircle,
        },
        {
          href: "/admin/donations",
          label: "Verify Donations",
          icon: HeartHandshake,
        },
        {
          href: "/admin/users",
          label: "User Governance",
          icon: Users,
        },
        {
          href: "/admin/payments",
          label: "Payment Audits",
          icon: CreditCard,
        },
      ];
    }

    // Default fallback
    return [
      {
        href: "/requester",
        label: "Overview",
        icon: LayoutDashboard,
      },
    ];
  };

  const roleNavItems = getRoleNavItems();

  const sharedNavItems: SidebarNavItem[] = [
    {
      href: "/dashboard/profile",
      label: "Profile & Sessions",
      icon: Shield,
    },
    {
      href: "/dashboard/support-us",
      label: "Support PulseBridge",
      icon: Heart,
    },
  ];

  const renderNavGroup = (items: SidebarNavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                isActive
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/30 font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-2 pb-1">
          <Logo size="md" />
        </div>

        {/* Role Portal Indicator */}
        <div className="rounded-xl border border-red-100 bg-red-50/70 px-3 py-2 text-xs dark:border-red-950/60 dark:bg-red-950/30">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-900 dark:text-red-200">
              Active Portal
            </span>
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              {user?.role || "USER"}
            </span>
          </div>
        </div>

        {/* Role Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {renderNavGroup(roleNavItems)}
        </div>

        {/* Shared Management Links */}
        <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account & Support
          </div>
          {renderNavGroup(sharedNavItems)}
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-xs font-bold text-white shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {user?.name || "Pulse User"}
              </div>
              <div className="truncate text-[10px] text-slate-400">
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Toggle Header (< lg screens) */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
        <Logo size="sm" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          aria-label="Toggle Dashboard Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-2xl dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Dashboard Navigation"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (lg+ screens) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {sidebarContent}
      </aside>
    </>
  );
}
