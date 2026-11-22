import { FormSkeleton } from "@/components/shared/FormSkeleton";

export default function DonationLogLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
      </div>

      <FormSkeleton fields={5} columns={2} showButtons={true} />
    </div>
  );
}
