import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  User,
  UserRole,
  BloodGroup,
  SessionInfo,
} from "@/types";

export type UserSession = SessionInfo;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  bloodGroup?: BloodGroup;
  district?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface GoogleAuthUrlResponse {
  authUrl: string;
  clientId: string;
  defaultRole: UserRole;
}

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return res.data;
  },

  async loginWithGoogleToken(idToken: string): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/google", {
      credential: idToken,
      idToken,
    });
    return res.data;
  },

  async getGoogleAuthUrl(): Promise<ApiResponse<GoogleAuthUrlResponse>> {
    const res = await apiClient.get<ApiResponse<GoogleAuthUrlResponse>>("/auth/google");
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User }>> {
    const res = await apiClient.post<ApiResponse<{ user: User }>>("/auth/register", payload);
    return res.data;
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse<{ verified: boolean }>> {
    const res = await apiClient.post<ApiResponse<{ verified: boolean }>>("/auth/verify-email", payload);
    return res.data;
  },

  async resendVerificationOtp(payload: ResendOtpPayload): Promise<ApiResponse<{ sent: boolean }>> {
    const res = await apiClient.post<ApiResponse<{ sent: boolean }>>("/auth/resend-verification-otp", payload);
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", payload);
    return res.data;
  },

  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<ApiResponse<{ resetToken: string }>> {
    const res = await apiClient.post<ApiResponse<{ resetToken: string }>>("/auth/verify-reset-otp", payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", payload);
    return res.data;
  },

  async getActiveSessions(): Promise<ApiResponse<UserSession[]>> {
    const res = await apiClient.get<ApiResponse<UserSession[]>>("/auth/sessions");
    return res.data;
  },

  async revokeSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/auth/sessions/${sessionId}`);
    return res.data;
  },

  async revokeAllOtherSessions(): Promise<ApiResponse<{ count: number }>> {
    const res = await apiClient.delete<ApiResponse<{ count: number }>>("/auth/sessions");
    return res.data;
  },
};
