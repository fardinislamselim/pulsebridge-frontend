"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { RequestUrgency } from "@/types";

export function useAdminBloodRequests(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin-blood-requests", filters],
    queryFn: async () => {
      const res = await adminService.getAdminBloodRequests(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approveBloodRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Blood request approved for donor matching");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to approve blood request");
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectBloodRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Blood request rejected");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to reject blood request");
    },
  });
}

export function useUpdateRequestUrgency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, urgency }: { id: string; urgency: RequestUrgency }) =>
      adminService.updateRequestUrgency(id, urgency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      toast.success("Request urgency triage updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update request urgency");
    },
  });
}

export function useExpireRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.expireBloodRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Blood request marked as expired");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to expire blood request");
    },
  });
}

export function useAdminDonations(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin-donations", filters],
    queryFn: async () => {
      const res = await adminService.getAdminDonations(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useVerifyDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminService.verifyDonation(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Donation verified. 90-day cooldown initiated for donor.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to verify donation");
    },
  });
}

export function useRejectDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectDonation(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast.success("Donation record rejected");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to reject donation");
    },
  });
}
