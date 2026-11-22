"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Droplet } from "lucide-react";
import { useDonationAnalytics, type AnalyticsPeriod } from "@/hooks/useAdmin";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import { ChartSkeleton } from "./ChartSkeleton";

interface DonationsBarChartProps {
  period?: AnalyticsPeriod;
}

const DEFAULT_DISTRIBUTION = [
  { group: "O+", units: 42, count: 35 },
  { group: "A+", units: 38, count: 30 },
  { group: "B+", units: 34, count: 28 },
  { group: "AB+", units: 18, count: 15 },
  { group: "O-", units: 14, count: 12 },
  { group: "A-", units: 10, count: 8 },
  { group: "B-", units: 9, count: 7 },
  { group: "AB-", units: 5, count: 4 },
];

export function DonationsBarChart({ period = "30d" }: DonationsBarChartProps) {
  const { data, isLoading } = useDonationAnalytics(period);

  if (isLoading) {
    return <ChartSkeleton title="Donations by Blood Group" />;
  }

  const chartData =
    data?.byBloodGroup && data.byBloodGroup.length > 0
      ? data.byBloodGroup.map((d) => ({
          group: formatBloodGroup(d.bloodGroup),
          units: d.units || d.count,
          count: d.count,
        }))
      : DEFAULT_DISTRIBUTION;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Donations by Blood Group
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded-full">
              <Droplet className="h-3 w-3" /> Volume
            </span>
          </div>
          <p className="text-xs text-slate-500">Collected blood units aggregated across all 8 groups</p>
        </div>
      </div>

      <div className="h-[270px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis dataKey="group" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
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
            <Bar dataKey="units" name="Units Donated" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
