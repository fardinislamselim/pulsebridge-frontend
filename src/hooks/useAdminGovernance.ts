"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { UserStatus, UserRole } from "@/types";

export function useAdminUsers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      const res = await adminService.getAdminUsers(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("User status updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user status");
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("User role updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user role");
    },
  });
}

export function useAdminDonors(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin-donors", filters],
    queryFn: async () => {
      const res = await adminService.getAdminDonors(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useToggleDonorVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      adminService.toggleDonorVerification(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Donor verification status updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update donor verification");
    },
  });
}

export function useUpdateDonorRestrictions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { hasMedicalRestriction: boolean; medicalRestrictionReason?: string };
    }) => adminService.updateDonorRestrictions(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donors"] });
      toast.success("Donor medical restrictions updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update donor restriction");
    },
  });
}

export function useAdminPaymentStats() {
  return useQuery({
    queryKey: ["admin-payment-stats"],
    queryFn: async () => {
      const res = await adminService.getAdminPaymentStats();
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminPayments(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin-payments", filters],
    queryFn: async () => {
      const res = await adminService.getAdminPayments(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: { amount?: number; reason: string };
    }) => adminService.refundPayment(paymentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payment-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Payment refunded successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to refund payment");
    },
  });
}
