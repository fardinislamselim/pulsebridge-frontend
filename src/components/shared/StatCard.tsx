import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
  iconBgClass?: string;
  className?: string;
}

/**
 * StatCard - Pure Server / Presentational Component
 * Standardized metric card for dashboards and statistics summaries.
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass = "text-red-600 dark:text-red-400",
  iconBgClass = "bg-red-50 dark:bg-red-950/60",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            iconBgClass,
            iconColorClass
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
}
