import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bloodRequestService,
  type CreateBloodRequestPayload,
  type UpdateBloodRequestPayload,
  type CancelBloodRequestPayload,
  type BloodRequestQueryParams,
} from "@/services/blood-request.service";

export const bloodRequestKeys = {
  all: ["blood-requests"] as const,
  lists: () => [...bloodRequestKeys.all, "list"] as const,
  list: (params?: BloodRequestQueryParams) =>
    [...bloodRequestKeys.lists(), params] as const,
  my: (params?: BloodRequestQueryParams) =>
    ["my-blood-requests", params] as const,
  details: () => [...bloodRequestKeys.all, "detail"] as const,
  detail: (id: string) => ["blood-request", id] as const,
  history: (id: string) => ["blood-request-history", id] as const,
  matchedDonors: (id: string) => ["matched-donors", id] as const,
};

export function useMyBloodRequests(params?: BloodRequestQueryParams) {
  return useQuery({
    queryKey: bloodRequestKeys.my(params),
    queryFn: async () => {
      const res = await bloodRequestService.getMyRequests(params);
      return res.data;
    },
  });
}

export function useBloodRequestDetails(id: string) {
  return useQuery({
    queryKey: bloodRequestKeys.detail(id),
    queryFn: async () => {
      const res = await bloodRequestService.getRequestById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useBloodRequestHistory(id: string) {
  return useQuery({
    queryKey: bloodRequestKeys.history(id),
    queryFn: async () => {
      try {
        const res = await bloodRequestService.getRequestHistory(id);
        return res.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!id,
  });
}

export function useCreateBloodRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBloodRequestPayload) =>
      bloodRequestService.createRequest(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Blood request created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        "Failed to create blood request. Please check inputs.";
      toast.error(msg);
    },
  });
}

export function useUpdateBloodRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBloodRequestPayload) =>
      bloodRequestService.updateRequest(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "Blood request updated successfully!");
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.history(id) });
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.matchedDonors(id) });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        "Failed to update blood request. Please check inputs.";
      toast.error(msg);
    },
  });
}

export function useCancelBloodRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CancelBloodRequestPayload) =>
      bloodRequestService.cancelRequest(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "Blood request cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.history(id) });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message || "Failed to cancel request. Please try again.";
      toast.error(msg);
    },
  });
}
