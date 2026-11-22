import type {
  BloodGroup,
  RequestUrgency,
  RequestStatus,
  DonationStatus,
  UserRole,
  UserStatus,
  PaginationMeta,
} from "./index";

export interface DashboardOverviewData {
  users: {
    total: number;
    donors: number;
    requesters: number;
    admins: number;
    active: number;
    blocked: number;
    verified: number;
    newToday: number;
    newThisMonth: number;
  };
  donors: {
    total: number;
    available: number;
    unavailable: number;
    eligible: number;
    temporarilyIneligible: number;
    verified: number;
  };
  bloodRequests: {
    total: number;
    pending: number;
    approved: number;
    matching: number;
    inProgress: number;
    fulfilled: number;
    emergency: number;
    urgent: number;
    normal: number;
  };
  donations: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
    totalUnitsDonated: number;
  };
  payments: {
    totalTransactions: number;
    successful: number;
    totalSuccessfulAmount: number;
    totalRefundedAmount: number;
    netCollectedAmount: number;
  };
  emergency: {
    activeRequests: number;
    fulfilledRequests: number;
    unfulfilledRequests: number;
  };
}

export interface PlatformActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: {
    id: string;
    displayName: string;
  } | null;
  resource: {
    type: string;
    id: string;
  };
  createdAt: string;
}

export interface RecentActivitiesResponse {
  activities: PlatformActivityItem[];
  pagination: PaginationMeta;
}

export interface GrowthAnalyticsData {
  metrics: {
    users: { current: number; previous: number; growthPercentage: number | null };
    donors: { current: number; previous: number; growthPercentage: number | null };
    bloodRequests: { current: number; previous: number; growthPercentage: number | null };
    completedDonations: { current: number; previous: number; growthPercentage: number | null };
    payments: { current: number; previous: number; growthPercentage: number | null };
  };
  monthlyPlatformActivity: Array<{
    month: string;
    users: number;
    requests: number;
    donations: number;
  }>;
}

export interface BloodRequestAnalyticsData {
  summary: {
    totalRequests: number;
    createdToday: number;
    createdThisMonth: number;
    approvedRequests: number;
    fullyFulfilledRequests: number;
    emergency: number;
  };
  byUrgency: Record<RequestUrgency, number>;
  byStatus: Record<RequestStatus, number>;
  byBloodGroup: Array<{
    bloodGroup: BloodGroup;
    count: number;
    unitsRequired: number;
    unitsFulfilled: number;
  }>;
}

export interface DonationAnalyticsData {
  summary: {
    totalDonationRecords: number;
    completedDonations: number;
    pendingDonations: number;
    rejectedDonations: number;
    totalDonatedUnits: number;
  };
  byBloodGroup: Array<{ bloodGroup: BloodGroup; count: number; units: number }>;
  donationTrend: Array<{ date: string; count: number; units: number }>;
}

export interface UserAnalyticsData {
  summary: {
    totalRegistered: number;
    donors: number;
    requesters: number;
    activeUsers: number;
    newThisMonth: number;
  };
  roleDistribution: Record<string, number>;
}
