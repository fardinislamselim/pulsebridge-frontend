"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService, type InitiatePaymentPayload } from "@/services/payment.service";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) => paymentService.initiatePayment(payload),
    onSuccess: (data) => {
      const paymentUrl = data.data?.paymentUrl;
      if (paymentUrl) {
        toast.success("Redirecting to secure payment gateway...");
        window.location.href = paymentUrl;
      } else {
        toast.error("Payment initiated, but no redirect URL was returned.");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to initiate payment. Please try again.";
      toast.error(msg);
    },
  });
}

export function useMyPayments(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ["my-payments", params],
    queryFn: async () => {
      const res = await paymentService.getMyPayments(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}
