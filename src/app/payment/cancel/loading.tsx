import { FormSkeleton } from "@/components/shared/FormSkeleton";

export default function PaymentCancelLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg">
        <FormSkeleton fields={2} columns={1} showButtons={true} />
      </div>
    </div>
  );
}
