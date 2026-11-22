import { Metadata } from "next";
import { GovernanceTabsClient } from "@/components/admin/users/GovernanceTabsClient";

export const metadata: Metadata = {
  title: "User & Donor Governance | PulseBridge Admin",
  description: "Platform user role governance, account status control, and donor medical safety management.",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          User & Donor Governance
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage user account lifecycle, role promotion, unmasked donor profiles, and clinical medical restrictions.
        </p>
      </div>

      <GovernanceTabsClient />
    </div>
  );
}
