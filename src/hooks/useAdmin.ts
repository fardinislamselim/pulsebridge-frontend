"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await adminService.getAdminOverview();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useRecentActivities(page = 1, limit = 8) {
  return useQuery({
    queryKey: ["admin-recent-activities", page, limit],
    queryFn: async () => {
      const res = await adminService.getRecentActivities({ page, limit });
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useGrowthAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-growth-analytics", period],
    queryFn: async () => {
      const res = await adminService.getGrowthAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useBloodRequestAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-blood-request-analytics", period],
    queryFn: async () => {
      const res = await adminService.getBloodRequestAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useDonationAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-donation-analytics", period],
    queryFn: async () => {
      const res = await adminService.getDonationAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useUserAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-user-analytics", period],
    queryFn: async () => {
      const res = await adminService.getUserAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useEmergencyAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-emergency-analytics", period],
    queryFn: async () => {
      const res = await adminService.getEmergencyAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePaymentAnalytics(period: AnalyticsPeriod = "30d") {
  return useQuery({
    queryKey: ["admin-payment-analytics", period],
    queryFn: async () => {
      const res = await adminService.getPaymentAnalytics(period);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}
