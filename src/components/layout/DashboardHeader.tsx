"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Shield, ChevronRight, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/shared/UserAvatar";

interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Helper to determine portal title and breadcrumb
  const getPortalInfo = () => {
    if (pathname.startsWith("/admin")) {
      return { portal: "Admin Command Center", section: pathname.replace("/admin", "").replace("/", "") || "Overview" };
    }
    if (pathname.startsWith("/donor")) {
      return { portal: "Donor Hub", section: pathname.replace("/donor", "").replace("/", "") || "Overview" };
    }
    if (pathname.startsWith("/requester")) {
      return { portal: "Requester Portal", section: pathname.replace("/requester", "").replace("/", "") || "Overview" };
    }
    if (pathname.startsWith("/dashboard/profile")) {
      return { portal: "Dashboard", section: "Account & Profile" };
    }
    if (pathname.startsWith("/dashboard/support-us")) {
      return { portal: "Dashboard", section: "Support PulseBridge" };
    }
    return { portal: "Dashboard", section: "Overview" };
  };

  const { portal, section } = getPortalInfo();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="text-foreground font-bold">{portal}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="capitalize text-red-600 font-bold">{section.replace("-", " ")}</span>
        </div>
      </div>

      {/* Right: Quick Links & Profile Shortcut */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground hover:bg-accent"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to Site</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg border border-border bg-background p-1 pr-2.5 transition hover:bg-accent"
          title="Account Profile & Security"
        >
          <UserAvatar user={user} size="sm" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight text-foreground truncate max-w-[120px]">
              {user?.name || "User"}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">
              {user?.role || "PORTAL"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
