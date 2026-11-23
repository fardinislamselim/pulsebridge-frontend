import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  BloodRequest,
  BloodGroup,
  RequestUrgency,
  RequestStatus,
  PublicDonor,
  BloodCompatibility,
} from "@/types";

export interface SystemHealth {
  status: string;
  uptime?: number;
  timestamp?: string;
  environment?: string;
  version?: string;
}

export interface PublicBloodRequestParams {
  page?: number;
  limit?: number;
  bloodGroup?: BloodGroup;
  district?: string;
  urgency?: RequestUrgency;
  status?: RequestStatus;
}

export interface PublicDonorParams {
  page?: number;
  limit?: number;
  bloodGroup?: BloodGroup;
  district?: string;
  city?: string;
  isAvailable?: boolean;
  isVerified?: boolean;
}

export interface NearbyDonorParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  bloodGroup?: BloodGroup;
  limit?: number;
}

export interface CompatibilityParams {
  donorBloodGroup?: BloodGroup;
  recipientBloodGroup?: BloodGroup;
}

export const publicService = {
  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    const res = await apiClient.get<ApiResponse<SystemHealth>>("/health");
    return res.data;
  },

  async getPublicBloodRequests(
    params?: PublicBloodRequestParams
  ): Promise<ApiResponse<BloodRequest[]>> {
    const res = await apiClient.get<ApiResponse<BloodRequest[]>>("/blood-requests", {
      params,
    });
    return res.data;
  },

  async getPublicBloodRequestById(
    requestId: string
  ): Promise<ApiResponse<BloodRequest>> {
    const res = await apiClient.get<ApiResponse<BloodRequest>>(
      `/blood-requests/${requestId}`
    );
    return res.data;
  },

  async getPublicDonors(
    params?: PublicDonorParams
  ): Promise<ApiResponse<PublicDonor[]>> {
    const res = await apiClient.get<ApiResponse<PublicDonor[]>>("/donors", {
      params,
    });
    return res.data;
  },

  async getNearbyDonors(
    params: NearbyDonorParams
  ): Promise<ApiResponse<PublicDonor[]>> {
    const res = await apiClient.get<ApiResponse<PublicDonor[]>>("/donors/nearby", {
      params,
    });
    return res.data;
  },

  async checkBloodCompatibility(
    params: CompatibilityParams
  ): Promise<ApiResponse<BloodCompatibility>> {
    const res = await apiClient.get<ApiResponse<BloodCompatibility>>(
      "/matching/compatibility",
      { params }
    );
    return res.data;
  },
};
