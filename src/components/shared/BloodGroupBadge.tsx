import React from "react";
import { cn } from "@/lib/utils";
import type { BloodGroup } from "@/types";

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup | string | null | undefined;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "subtle" | "outline";
  showRhDetail?: boolean;
  className?: string;
}

// Convert backend enum format to human medical abbreviation
export const formatBloodGroup = (group?: string | null): string => {
  if (!group) return "Unknown";
  switch (group) {
    case "A_POSITIVE":
      return "A+";
    case "A_NEGATIVE":
      return "A-";
    case "B_POSITIVE":
      return "B+";
    case "B_NEGATIVE":
      return "B-";
    case "AB_POSITIVE":
      return "AB+";
    case "AB_NEGATIVE":
      return "AB-";
    case "O_POSITIVE":
      return "O+";
    case "O_NEGATIVE":
      return "O-";
    default:
      return group.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  }
};

/**
 * BloodGroupBadge - Pure Server Component
 * Formats blood group enums into high-contrast crimson medical badges.
 */
export function BloodGroupBadge({
  bloodGroup,
  size = "md",
  variant = "solid",
  showRhDetail = false,
  className,
}: BloodGroupBadgeProps) {
  const formatted = formatBloodGroup(bloodGroup);
  const isNegative = formatted.includes("-");

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-bold gap-1",
    md: "px-2.5 py-1 text-sm font-bold gap-1.5",
    lg: "px-3.5 py-1.5 text-base font-extrabold gap-2",
  }[size];

  const variantStyles = {
    solid:
      "bg-red-600 text-white shadow-sm shadow-red-600/30 border border-red-700",
    subtle:
      "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900",
    outline:
      "bg-transparent text-red-600 border border-red-600 dark:text-red-400 dark:border-red-500",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg font-mono tracking-tight select-none",
        sizeStyles,
        variantStyles,
        className
      )}
      title={`Blood Group: ${formatted}${isNegative ? " (Rh-Negative)" : " (Rh-Positive)"}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{formatted}</span>
      {showRhDetail && (
        <span className="text-[10px] uppercase font-sans tracking-normal opacity-90 font-medium">
          {isNegative ? "Rh-" : "Rh+"}
        </span>
      )}
    </span>
  );
}
