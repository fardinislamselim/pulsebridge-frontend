import { StatCardSkeleton } from "@/components/shared/StatCardSkeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function AdminPaymentsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-72 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton count={4} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <TableSkeleton rows={8} columns={6} />
      </div>
    </div>
  );
}
