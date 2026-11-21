import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  BloodGroup,
  MatchedEligibleDonor,
  BloodCompatibility,
} from "@/types";

export interface CompatibilityQueryParams {
  donorBloodGroup?: BloodGroup;
  recipientBloodGroup?: BloodGroup;
}

export interface FindDonorsQueryParams {
  requestId?: string;
  bloodGroup?: BloodGroup;
  district?: string;
  city?: string;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export const matchingService = {
  async checkCompatibility(
    params: CompatibilityQueryParams
  ): Promise<ApiResponse<BloodCompatibility>> {
    const res = await apiClient.get<ApiResponse<BloodCompatibility>>(
      "/matching/compatibility",
      { params }
    );
    return res.data;
  },

  async findDonors(
    params: FindDonorsQueryParams
  ): Promise<ApiResponse<MatchedEligibleDonor[]>> {
    const res = await apiClient.get<ApiResponse<MatchedEligibleDonor[]>>(
      "/matching/find-donors",
      { params }
    );
    return res.data;
  },
};
