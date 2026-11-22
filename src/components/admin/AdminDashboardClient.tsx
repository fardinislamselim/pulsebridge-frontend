"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Users, AlertOctagon, Filter } from "lucide-react";
import { useAdminOverview, type AnalyticsPeriod } from "@/hooks/useAdmin";
import { AdminOverviewStats } from "./AdminOverviewStats";
import { GrowthAreaChart } from "./charts/GrowthAreaChart";
import { RequestsUrgencyPieChart } from "./charts/RequestsUrgencyPieChart";
import { DonationsBarChart } from "./charts/DonationsBarChart";
import { RecentActivitiesCard } from "./RecentActivitiesCard";

export function AdminDashboardClient() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const { data: overview, isLoading } = useAdminOverview();

  return (
    <div className="space-y-6">
      {/* Control Bar: Quick Filters & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Link
            href="/blood-requests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <AlertOctagon className="h-3.5 w-3.5 text-red-600" />
            <span>Requests Queue</span>
          </Link>
          <Link
            href="/donors"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <Users className="h-3.5 w-3.5 text-blue-600" />
            <span>Donors Registry</span>
          </Link>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          {(["7d", "30d", "90d"] as AnalyticsPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                period === p
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <AdminOverviewStats overview={overview} isLoading={isLoading} />

      {/* Main Growth Area Chart */}
      <GrowthAreaChart period={period} />

      {/* 2-Column Sub Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestsUrgencyPieChart period={period} />
        <DonationsBarChart period={period} />
      </div>

      {/* Operational Activities Feed */}
      <RecentActivitiesCard />
    </div>
  );
}
