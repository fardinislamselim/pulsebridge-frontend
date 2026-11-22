import { FormSkeleton } from "@/components/shared/FormSkeleton";

export default function PaymentPageLoading() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <FormSkeleton fields={3} columns={1} showButtons={false} />
      </div>
    </div>
  );
}
