import apiClient from "@/lib/axios";
import type { ApiResponse, BloodRequest, Donation, User, PublicDonor, Payment, RequestUrgency, UserStatus, UserRole } from "@/types";
import type { DashboardOverviewData, RecentActivitiesResponse, GrowthAnalyticsData, BloodRequestAnalyticsData, DonationAnalyticsData, UserAnalyticsData } from "@/types/admin.types";

export const adminService = {
  // Overview & Feed
  async getAdminOverview(): Promise<ApiResponse<DashboardOverviewData>> {
    return (await apiClient.get<ApiResponse<DashboardOverviewData>>("/admin/dashboard/overview")).data;
  },
  async getRecentActivities(params?: { page?: number; limit?: number; type?: string }): Promise<ApiResponse<RecentActivitiesResponse>> {
    return (await apiClient.get<ApiResponse<RecentActivitiesResponse>>("/admin/dashboard/recent-activities", { params })).data;
  },

  // Analytics Endpoints
  async getUserAnalytics(period = "30d"): Promise<ApiResponse<UserAnalyticsData>> {
    return (await apiClient.get<ApiResponse<UserAnalyticsData>>("/admin/analytics/users", { params: { period } })).data;
  },
  async getDonorAnalytics(period = "30d"): Promise<ApiResponse<any>> {
    return (await apiClient.get<ApiResponse<any>>("/admin/analytics/donors", { params: { period } })).data;
  },
  async getBloodRequestAnalytics(period = "30d"): Promise<ApiResponse<BloodRequestAnalyticsData>> {
    return (await apiClient.get<ApiResponse<BloodRequestAnalyticsData>>("/admin/analytics/blood-requests", { params: { period } })).data;
  },
  async getDonationAnalytics(period = "30d"): Promise<ApiResponse<DonationAnalyticsData>> {
    return (await apiClient.get<ApiResponse<DonationAnalyticsData>>("/admin/analytics/donations", { params: { period } })).data;
  },
  async getEmergencyAnalytics(period = "30d"): Promise<ApiResponse<any>> {
    return (await apiClient.get<ApiResponse<any>>("/admin/analytics/emergency", { params: { period } })).data;
  },
  async getPaymentAnalytics(period = "30d"): Promise<ApiResponse<any>> {
    return (await apiClient.get<ApiResponse<any>>("/admin/analytics/payments", { params: { period } })).data;
  },
  async getGrowthAnalytics(period = "30d"): Promise<ApiResponse<GrowthAnalyticsData>> {
    return (await apiClient.get<ApiResponse<GrowthAnalyticsData>>("/admin/analytics/growth", { params: { period } })).data;
  },

  // Moderation & Governance: Requests
  async getAdminBloodRequests(params?: any): Promise<ApiResponse<BloodRequest[]>> {
    return (await apiClient.get<ApiResponse<BloodRequest[]>>("/admin/blood-requests", { params })).data;
  },
  async approveBloodRequest(id: string): Promise<ApiResponse<BloodRequest>> {
    return (await apiClient.patch<ApiResponse<BloodRequest>>(`/admin/blood-requests/${id}/approve`)).data;
  },
  async rejectBloodRequest(id: string, reason: string): Promise<ApiResponse<BloodRequest>> {
    return (await apiClient.patch<ApiResponse<BloodRequest>>(`/admin/blood-requests/${id}/reject`, { reason })).data;
  },
  async updateRequestUrgency(id: string, urgency: RequestUrgency): Promise<ApiResponse<BloodRequest>> {
    return (await apiClient.patch<ApiResponse<BloodRequest>>(`/admin/blood-requests/${id}/urgency`, { urgency })).data;
  },
  async expireBloodRequest(id: string): Promise<ApiResponse<BloodRequest>> {
    return (await apiClient.patch<ApiResponse<BloodRequest>>(`/admin/blood-requests/${id}/expire`)).data;
  },

  // Moderation & Governance: Donations
  async getAdminDonations(params?: any): Promise<ApiResponse<Donation[]>> {
    return (await apiClient.get<ApiResponse<Donation[]>>("/admin/donations", { params })).data;
  },
  async verifyDonation(id: string, notes?: string): Promise<ApiResponse<Donation>> {
    return (await apiClient.patch<ApiResponse<Donation>>(`/donations/${id}/verify`, { notes })).data;
  },
  async rejectDonation(id: string, reason: string): Promise<ApiResponse<Donation>> {
    return (await apiClient.patch<ApiResponse<Donation>>(`/donations/${id}/reject`, { reason })).data;
  },

  // Moderation & Governance: Users
  async getAdminUsers(params?: any): Promise<ApiResponse<User[]>> {
    return (await apiClient.get<ApiResponse<User[]>>("/admin/users", { params })).data;
  },
  async updateUserStatus(id: string, status: UserStatus): Promise<ApiResponse<User>> {
    return (await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/status`, { status })).data;
  },
  async updateUserRole(id: string, role: UserRole): Promise<ApiResponse<User>> {
    return (await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/role`, { role })).data;
  },

  // Moderation & Governance: Donors
  async getAdminDonors(params?: any): Promise<ApiResponse<PublicDonor[]>> {
    return (await apiClient.get<ApiResponse<PublicDonor[]>>("/admin/donors", { params })).data;
  },
  async toggleDonorVerification(id: string, isVerified: boolean): Promise<ApiResponse<any>> {
    return (await apiClient.patch<ApiResponse<any>>(`/admin/donors/${id}/verification`, { isVerified })).data;
  },
  async updateDonorRestrictions(id: string, payload: { hasMedicalRestriction: boolean; medicalRestrictionReason?: string }): Promise<ApiResponse<any>> {
    return (await apiClient.patch<ApiResponse<any>>(`/admin/donors/${id}/restrictions`, payload)).data;
  },

  // Moderation & Governance: Payments
  async getAdminPaymentStats(): Promise<ApiResponse<any>> {
    return (await apiClient.get<ApiResponse<any>>("/admin/payments/statistics")).data;
  },
  async getAdminPayments(params?: any): Promise<ApiResponse<Payment[]>> {
    return (await apiClient.get<ApiResponse<Payment[]>>("/admin/payments", { params })).data;
  },
  async refundPayment(paymentId: string, payload: { amount?: number; reason: string }): Promise<ApiResponse<any>> {
    return (await apiClient.post<ApiResponse<any>>(`/admin/payments/${paymentId}/refund`, payload)).data;
  },
};
