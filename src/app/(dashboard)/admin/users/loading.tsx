import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
      </div>

      <div className="h-10 w-96 bg-slate-100 dark:bg-slate-850 rounded-lg animate-pulse" />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <TableSkeleton rows={8} columns={5} />
      </div>
    </div>
  );
}
