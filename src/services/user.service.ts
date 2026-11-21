import apiClient from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export const userService = {
  async getMe(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<ApiResponse<User>>("/users/me");
    return res.data;
  },

  async updateMe(payload: UpdateUserPayload): Promise<ApiResponse<User>> {
    const res = await apiClient.patch<ApiResponse<User>>("/users/me", payload);
    return res.data;
  },
};
