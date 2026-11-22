"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { AlertTriangle } from "lucide-react";
import { useBloodRequestAnalytics, type AnalyticsPeriod } from "@/hooks/useAdmin";
import { ChartSkeleton } from "./ChartSkeleton";

interface RequestsUrgencyPieChartProps {
  period?: AnalyticsPeriod;
}

const COLORS: Record<string, string> = {
  NORMAL: "#3b82f6",
  URGENT: "#f59e0b",
  EMERGENCY: "#ef4444",
};

const DEFAULT_URGENCY = [
  { name: "Normal", value: 45, key: "NORMAL" },
  { name: "Urgent", value: 30, key: "URGENT" },
  { name: "Emergency", value: 25, key: "EMERGENCY" },
];

export function RequestsUrgencyPieChart({ period = "30d" }: RequestsUrgencyPieChartProps) {
  const { data, isLoading } = useBloodRequestAnalytics(period);

  if (isLoading) {
    return <ChartSkeleton title="Request Urgency Breakdown" />;
  }

  const urgencyData = data?.byUrgency
    ? [
        { name: "Normal", value: data.byUrgency.NORMAL || 0, key: "NORMAL" },
        { name: "Urgent", value: data.byUrgency.URGENT || 0, key: "URGENT" },
        { name: "Emergency", value: data.byUrgency.EMERGENCY || 0, key: "EMERGENCY" },
      ].filter((d) => d.value > 0)
    : DEFAULT_URGENCY;

  const chartData = urgencyData.length > 0 ? urgencyData : DEFAULT_URGENCY;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Requests by Urgency
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full">
              <AlertTriangle className="h-3 w-3" /> Triage Ratio
            </span>
          </div>
          <p className="text-xs text-slate-500">Normal vs. Urgent vs. Emergency Distribution</p>
        </div>
      </div>

      <div className="h-[270px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.key}`} fill={COLORS[entry.key] || "#888888"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
