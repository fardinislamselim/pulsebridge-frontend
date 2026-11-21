import { BarChart3, Users, HeartHandshake, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
            System Administration & Governance
          </h1>
          <p className="text-sm text-slate-500">
            Platform health, emergency response queues, verified donor audits, and payment reconciliation.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Total Users</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Pending Requests</span>
              <ShieldAlert className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Donations Queue</span>
              <HeartHandshake className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Platform Funds</span>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0 BDT</div>
          </div>
        </div>

        {/* Analytics Placeholder */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
            Multi-Domain Analytics Feed
          </h2>
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
            Analytics visualization will be powered by Recharts (Requests by ABO Group, Monthly Trends, Urgency Distribution).
          </div>
        </div>
      </div>
    </div>
  );
}
