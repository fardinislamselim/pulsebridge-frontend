import { Heart, ShieldCheck, Activity, Calendar } from "lucide-react";

export default function DonorDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Donor Hub
            </h1>
            <p className="text-sm text-slate-500">
              Live availability toggle, 90-day medical cooldown tracking, and donation history.
            </p>
          </div>
        </div>

        {/* Live Availability & Cooldown Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Availability</span>
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready to Donate
                </span>
                <p className="mt-2 text-xs text-slate-500">
                  Visible to emergency matching algorithms.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">90-Day Cooldown</span>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">Eligible</div>
              <p className="mt-1 text-xs text-slate-500">No active cooldown restriction.</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Total Donations</span>
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">0</div>
              <p className="mt-1 text-xs text-slate-500">Verified donations on PulseBridge.</p>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
              Recent Donation Activity
            </h2>
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
            No verified donations recorded yet. When you complete a donation, records will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
