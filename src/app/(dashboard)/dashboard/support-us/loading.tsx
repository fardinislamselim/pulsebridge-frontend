import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function SupportUsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <FormSkeleton fields={4} columns={1} showButtons={true} />
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <TableSkeleton rows={4} columns={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
