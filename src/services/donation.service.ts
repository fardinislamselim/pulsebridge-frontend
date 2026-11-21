import apiClient from "@/lib/axios";
import type { ApiResponse, Donation } from "@/types";

export interface CreateDonationPayload {
  donorId?: string;
  donorProfileId?: string;
  bloodRequestId: string;
  unitsDonated: number;
  hospitalName?: string;
  hospitalAddress?: string;
  donationDate?: string;
  notes?: string;
}

export const donationService = {
  async createDonation(
    payload: CreateDonationPayload
  ): Promise<ApiResponse<Donation>> {
    const donorId = payload.donorId || payload.donorProfileId || "";
    const res = await apiClient.post<ApiResponse<Donation>>("/donations", {
      ...payload,
      donorId,
    });
    return res.data;
  },
};
