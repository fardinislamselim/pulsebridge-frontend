"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { donorService, type UpdateDonorProfilePayload } from "@/services/donor.service";

export function useDonorProfile() {
  return useQuery({
    queryKey: ["donor-profile"],
    queryFn: async () => {
      const res = await donorService.getMyDonorProfile();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useUpdateDonorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDonorProfilePayload) =>
      donorService.updateMyDonorProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["donor-eligibility"] });
      toast.success("Donor profile updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update donor profile";
      toast.error(message);
    },
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      donorService.toggleDonorAvailability(isAvailable),
    onSuccess: (_, isAvailable) => {
      queryClient.invalidateQueries({ queryKey: ["donor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["donor-eligibility"] });
      toast.success(
        isAvailable
          ? "Availability enabled. You are now visible to emergency requests."
          : "Availability disabled. You will not receive emergency alerts."
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update availability status";
      toast.error(message);
    },
  });
}

export function useDonorEligibility() {
  return useQuery({
    queryKey: ["donor-eligibility"],
    queryFn: async () => {
      const res = await donorService.getMyDonorEligibility();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useMyDonations(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["my-donations", params],
    queryFn: async () => {
      const res = await donorService.getMyDonations(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}
