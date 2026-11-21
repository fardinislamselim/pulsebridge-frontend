import Link from "next/link";
import { PlusCircle, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function RequesterDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Requester Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage your blood requests, track matching status, and log received donations.
            </p>
          </div>
          <Link
            href="/requester/requests/new"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-700"
          >
            <PlusCircle className="h-4 w-4" />
            New Blood Request
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Total Requests</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Active / Matching</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Fulfilled</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Units Received</span>
              <span className="text-xs font-bold text-red-600">Blood</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
            My Blood Requests
          </h2>
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
            No blood requests found. Click &quot;New Blood Request&quot; to initiate a request.
          </div>
        </div>
      </div>
    </div>
  );
}
