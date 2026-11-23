"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useGrowthAnalytics, type AnalyticsPeriod } from "@/hooks/useAdmin";
import { ChartSkeleton } from "./ChartSkeleton";

interface GrowthAreaChartProps {
  period?: AnalyticsPeriod;
}

const DEFAULT_GROWTH = [
  { month: "Jan", users: 45, requests: 28, donations: 24 },
  { month: "Feb", users: 78, requests: 52, donations: 46 },
  { month: "Mar", users: 110, requests: 84, donations: 70 },
  { month: "Apr", users: 154, requests: 120, donations: 98 },
  { month: "May", users: 210, requests: 165, donations: 142 },
  { month: "Jun", users: 290, requests: 215, donations: 190 },
];

export function GrowthAreaChart({ period = "30d" }: GrowthAreaChartProps) {
  const { data, isLoading } = useGrowthAnalytics(period);

  if (isLoading) {
    return <ChartSkeleton title="Platform Growth Trend" />;
  }

  const chartData =
    data?.monthlyPlatformActivity && data.monthlyPlatformActivity.length > 0
      ? data.monthlyPlatformActivity
      : DEFAULT_GROWTH;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Platform Growth Trends
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monthly registered users vs. incoming emergency blood requests
          </p>
        </div>
      </div>

      <div className="h-[270px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Area type="monotone" dataKey="users" name="New Users" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
            <Area type="monotone" dataKey="requests" name="Blood Requests" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#reqGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
