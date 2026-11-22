import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  Payment,
  PaymentInitiateResult,
  PaymentVerificationResult,
  PaymentProvider,
  PaymentPurpose,
} from "@/types";

export interface InitiatePaymentPayload {
  amount: number;
  currency?: string;
  provider: PaymentProvider;
  paymentPurpose?: PaymentPurpose;
  description?: string;
  bloodRequestId?: string;
}

export const paymentService = {
  async initiatePayment(payload: InitiatePaymentPayload): Promise<ApiResponse<PaymentInitiateResult>> {
    const res = await apiClient.post<ApiResponse<PaymentInitiateResult>>("/payments/initiate", payload);
    return res.data;
  },

  async getMyPayments(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Payment[]>> {
    const res = await apiClient.get<ApiResponse<Payment[]>>("/payments/me", { params });
    return res.data;
  },

  async verifyPaymentById(paymentId: string): Promise<ApiResponse<PaymentVerificationResult>> {
    const res = await apiClient.get<ApiResponse<PaymentVerificationResult>>(`/payments/${paymentId}/verify`);
    return res.data;
  },
};
