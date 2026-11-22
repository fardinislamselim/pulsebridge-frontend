import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  DonorProfile,
  DonorEligibility,
  DonationHistoryResult,
  BloodGroup,
} from "@/types";

export interface UpdateDonorProfilePayload {
  name?: string;
  phone?: string;
  bloodGroup?: BloodGroup;
  dateOfBirth?: string;
  gender?: string;
  district?: string;
  city?: string;
  area?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export const donorService = {
  /**
   * Fetch authenticated user's full donor profile.
   */
  async getMyDonorProfile(): Promise<ApiResponse<DonorProfile>> {
    const res = await apiClient.get<ApiResponse<DonorProfile>>("/donors/me");
    return res.data;
  },

  /**
   * Update authenticated user's donor demographic, contact, and location details.
   */
  async updateMyDonorProfile(
    payload: UpdateDonorProfilePayload
  ): Promise<ApiResponse<DonorProfile>> {
    const res = await apiClient.patch<ApiResponse<DonorProfile>>(
      "/donors/me",
      payload
    );
    return res.data;
  },

  /**
   * Toggle donor availability for immediate emergency matching algorithms.
   */
  async toggleDonorAvailability(
    isAvailable: boolean
  ): Promise<ApiResponse<DonorProfile>> {
    const res = await apiClient.patch<ApiResponse<DonorProfile>>(
      "/donors/me/availability",
      { isAvailable }
    );
    return res.data;
  },

  /**
   * Evaluate multi-factor donor eligibility including 90-day cooldown and restrictions.
   */
  async getMyDonorEligibility(): Promise<ApiResponse<DonorEligibility>> {
    const res = await apiClient.get<ApiResponse<DonorEligibility>>(
      "/donors/me/eligibility"
    );
    return res.data;
  },

  /**
   * Fetch authenticated donor's own complete donation history and cooldown summary.
   */
  async getMyDonations(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<DonationHistoryResult>> {
    const res = await apiClient.get<ApiResponse<DonationHistoryResult>>(
      "/donations/me",
      { params }
    );
    return res.data;
  },
};
