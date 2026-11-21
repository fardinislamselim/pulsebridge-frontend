import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/**
 * EmptyState - Pure Server Component
 * High-trust clean empty state for tables, lists, and search results.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12 dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm dark:bg-red-950/50 dark:text-red-400">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-4 font-heading text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
