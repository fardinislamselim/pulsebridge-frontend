import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  ShieldCheck,
  RefreshCw,
  AlertOctagon,
} from "lucide-react";
import type {
  RequestUrgency,
  RequestStatus,
  DonationStatus,
  DonationVerificationStatus,
  PaymentStatus,
} from "@/types";

type AnyStatus =
  | RequestUrgency
  | RequestStatus
  | DonationStatus
  | DonationVerificationStatus
  | PaymentStatus
  | string;

interface StatusBadgeProps {
  status: AnyStatus;
  size?: "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

interface BadgeConfig {
  label: string;
  colorClass: string;
  icon: React.ComponentType<{ className?: string }>;
  pulse?: boolean;
}

const STATUS_MAP: Record<string, BadgeConfig> = {
  // Urgency
  EMERGENCY: {
    label: "Emergency",
    colorClass:
      "bg-red-600 text-white border-red-700",
    icon: AlertOctagon,
    pulse: true,
  },
  URGENT: {
    label: "Urgent",
    colorClass:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
  },
  NORMAL: {
    label: "Normal",
    colorClass:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-800",
    icon: Clock,
  },

  // Lifecycle
  PENDING: {
    label: "Pending",
    colorClass:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    colorClass:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
    icon: ShieldCheck,
  },
  MATCHING: {
    label: "Matching",
    colorClass:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
    icon: Activity,
    pulse: true,
  },
  IN_PROGRESS: {
    label: "In Progress",
    colorClass:
      "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
    icon: RefreshCw,
  },
  FULFILLED: {
    label: "Fulfilled",
    colorClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Completed",
    colorClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  VERIFIED: {
    label: "Verified",
    colorClass:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800",
    icon: ShieldCheck,
  },
  REJECTED: {
    label: "Rejected",
    colorClass:
      "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    colorClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: XCircle,
  },
  EXPIRED: {
    label: "Expired",
    colorClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    colorClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  SUCCESS: {
    label: "Success",
    colorClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    colorClass:
      "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
};

/**
 * StatusBadge - Pure Server Component
 * Accessible, color-coded badges for urgencies and lifecycle statuses.
 */
export function StatusBadge({
  status,
  size = "md",
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const normalizedKey = (status || "").toUpperCase();
  const config = STATUS_MAP[normalizedKey] || {
    label: status || "Unknown",
    colorClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: Clock,
  };

  const IconComponent = config.icon;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  }[size];

  return (
    <span
      className={cn(
 "inline-flex shrink-0 items-center rounded-full border font-semibold select-none transition-colors",
 sizeStyles,
 config.colorClass,
 className
 )}
    >
      {showIcon && (
        <span className={cn(config.pulse && "animate-pulse")}>
          <IconComponent className="h-3.5 w-3.5 shrink-0" />
        </span>
      )}
      <span>{config.label}</span>
      {config.pulse && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping opacity-75" />
      )}
    </span>
  );
}
