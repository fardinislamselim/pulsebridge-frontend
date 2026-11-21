import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  BloodRequest,
  BloodRequestHistoryItem,
  MatchedEligibleDonor,
  BloodGroup,
  RequestUrgency,
  RequestStatus,
} from "@/types";

export interface CreateBloodRequestPayload {
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsRequired?: number;
  hospitalName: string;
  hospitalAddress: string;
  district: string;
  city: string;
  area?: string;
  urgency: RequestUrgency;
  neededAt: string;
  requiredAt?: string;
  contactName?: string;
  contactPerson?: string;
  contactPhone: string;
  reason?: string;
  details?: string;
  additionalNotes?: string;
}

export interface UpdateBloodRequestPayload {
  patientName?: string;
  bloodGroup?: BloodGroup;
  unitsNeeded?: number;
  unitsRequired?: number;
  hospitalName?: string;
  hospitalAddress?: string;
  district?: string;
  city?: string;
  area?: string;
  urgency?: RequestUrgency;
  neededAt?: string;
  requiredAt?: string;
  contactName?: string;
  contactPerson?: string;
  contactPhone?: string;
  reason?: string;
  details?: string;
  additionalNotes?: string;
}

export interface CancelBloodRequestPayload {
  reason: string;
}

export interface BloodRequestQueryParams {
  page?: number;
  limit?: number;
  bloodGroup?: BloodGroup;
  district?: string;
  urgency?: RequestUrgency;
  status?: RequestStatus;
}

export const bloodRequestService = {
  async getPublicRequests(
    params?: BloodRequestQueryParams
  ): Promise<ApiResponse<BloodRequest[]>> {
    const res = await apiClient.get<ApiResponse<BloodRequest[]>>("/blood-requests", {
      params,
    });
    return res.data;
  },

  async getMyRequests(
    params?: BloodRequestQueryParams
  ): Promise<ApiResponse<BloodRequest[]>> {
    const res = await apiClient.get<ApiResponse<BloodRequest[]>>("/blood-requests/me", {
      params,
    });
    return res.data;
  },

  async getRequestById(id: string): Promise<ApiResponse<BloodRequest>> {
    const res = await apiClient.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
    return res.data;
  },

  async getRequestHistory(id: string): Promise<ApiResponse<BloodRequestHistoryItem[]>> {
    const res = await apiClient.get<ApiResponse<BloodRequestHistoryItem[]>>(
      `/blood-requests/${id}/history`
    );
    return res.data;
  },

  async createRequest(
    payload: CreateBloodRequestPayload
  ): Promise<ApiResponse<BloodRequest>> {
    const res = await apiClient.post<ApiResponse<BloodRequest>>("/blood-requests", payload);
    return res.data;
  },

  async updateRequest(
    id: string,
    payload: UpdateBloodRequestPayload
  ): Promise<ApiResponse<BloodRequest>> {
    const res = await apiClient.patch<ApiResponse<BloodRequest>>(
      `/blood-requests/${id}`,
      payload
    );
    return res.data;
  },

  async cancelRequest(
    id: string,
    payload: CancelBloodRequestPayload
  ): Promise<ApiResponse<BloodRequest>> {
    const res = await apiClient.patch<ApiResponse<BloodRequest>>(
      `/blood-requests/${id}/cancel`,
      payload
    );
    return res.data;
  },

  async getMatchedDonors(requestId: string): Promise<ApiResponse<MatchedEligibleDonor[]>> {
    const res = await apiClient.get<ApiResponse<MatchedEligibleDonor[]>>(
      `/matching/requests/${requestId}/donors`
    );
    return res.data;
  },
};
