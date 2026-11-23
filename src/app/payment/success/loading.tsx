import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <div className="space-y-3 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
