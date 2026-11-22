import { Metadata } from "next";
import { VoluntaryContributionForm } from "@/components/payment/VoluntaryContributionForm";
import { MyPaymentsTable } from "@/components/payment/MyPaymentsTable";

export const metadata: Metadata = {
  title: "Support PulseBridge | Voluntary Contributions",
  description: "Support our 24/7 emergency blood donation coordination platform. 100% voluntary platform maintenance support.",
};

export default function SupportUsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Support PulseBridge
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          PulseBridge operates 24/7 with zero fees for blood donors or recipients. Support server and SMS notification costs with voluntary contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <VoluntaryContributionForm />
        </div>
        <div className="lg:col-span-7">
          <MyPaymentsTable />
        </div>
      </div>
    </div>
  );
}
