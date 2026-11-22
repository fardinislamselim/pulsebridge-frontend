/**
 * PulseBridge - Strict TypeScript Domain Models
 * Blood Donation & Emergency Coordination Platform
 * All interfaces adhere to strict typing (zero `any`).
 */

// ==========================================
// 1. Core Enumerations & Union Types
// ==========================================

export type UserRole =
  | "USER"
  | "REQUESTER"
  | "DONOR"
  | "ADMIN"
  | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "MATCHING"
  | "IN_PROGRESS"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "CANCELLED"
  | "EXPIRED";

export type RequestUrgency = "NORMAL" | "URGENT" | "EMERGENCY";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type DonationStatus =
  | "PENDING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "FAILED";

export type DonationVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export type PaymentProvider = "SSLCOMMERZ" | "STRIPE";

export type PaymentPurpose =
  | "PLATFORM_SUPPORT"
  | "CAMPAIGN_DONATION"
  | "OTHER";

export type RefundStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type NotificationType =
  | "REQUEST"
  | "ASSIGNMENT"
  | "PAYMENT"
  | "SYSTEM";

export type NotificationStatus = "UNREAD" | "READ";

// ==========================================
// 2. User & Authentication Models
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  donorProfile?: DonorProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  isCurrent?: boolean;
  lastActive: string;
  createdAt: string;
}

// ==========================================
// 3. Donor Profile & Matching Models
// ==========================================

export interface DonorProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string | null;
  bloodGroup: BloodGroup | null;
  dateOfBirth: string | null;
  gender: string | null;
  district: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isAvailable: boolean;
  isVerified: boolean;
  hasMedicalRestriction: boolean;
  medicalRestrictionReason: string | null;
  lastDonationDate: string | null;
  eligibleAt: string | null;
  totalDonations?: number;
  createdAt: string;
  updatedAt: string;
  user?: Partial<User>;
}

export interface DonorEligibility {
  eligible: boolean;
  isEligible: boolean;
  canDonate: boolean;
  isAvailable?: boolean;
  reasons: string[];
  message: string;
  daysRemaining?: number;
  remainingCooldownDays: number;
  eligibleAt?: string | null;
  cooldownEndsAt?: string | null;
  lastDonationDate?: string | null;
}

export interface PublicDonor {
  id: string;
  bloodGroup: BloodGroup | null;
  district: string | null;
  city: string | null;
  area: string | null;
  isAvailable: boolean;
  isVerified: boolean;
  lastDonationDate: string | null;
  eligibleAt: string | null;
  distanceKm?: number;
  user: {
    name: string;
  };
}

export interface BloodCompatibility {
  canDonateTo?: BloodGroup[];
  canReceiveFrom?: BloodGroup[];
  compatible?: boolean;
  donorBloodGroup?: BloodGroup;
  recipientBloodGroup?: BloodGroup;
  compatibleRecipientBloodGroups?: BloodGroup[];
  compatibleDonorBloodGroups?: BloodGroup[];
  component?: string;
  reason?: string;
  requiresMedicalCrossmatch?: boolean;
}

// ==========================================
// 4. Blood Request & Assignment Models
// ==========================================

export interface BloodRequest {
  id: string;
  requesterId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsFulfilled?: number;
  hospitalName: string;
  hospitalAddress: string;
  district: string;
  city: string;
  area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactName?: string | null;
  contactPhone: string;
  neededAt: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  reason?: string | null;
  additionalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: Pick<User, "id" | "name" | "email" | "phone">;
  assignments?: RequestAssignment[];
  donations?: Donation[];
}

export interface RequestAssignment {
  id: string;
  bloodRequestId: string;
  donorId: string;
  status: AssignmentStatus;
  contactedAt: string;
  respondedAt?: string | null;
  notes?: string | null;
  donor?: DonorProfile;
}

export interface RequestTimelineEvent {
  id: string;
  status: RequestStatus;
  title: string;
  description: string;
  timestamp: string;
  performedBy?: string;
}

export interface BloodRequestHistoryItem {
  id: string;
  bloodRequestId: string;
  actorId?: string | null;
  action: string;
  previousStatus?: RequestStatus | null;
  newStatus?: RequestStatus | null;
  previousUrgency?: RequestUrgency | null;
  newUrgency?: RequestUrgency | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

export interface MatchedEligibleDonor {
  donorId: string;
  donorName?: string;
  donorBloodGroup: BloodGroup;
  requestedBloodGroup: BloodGroup;
  distanceKm?: number;
  district?: string | null;
  city?: string | null;
  area?: string | null;
  isAvailable: boolean;
  isVerified: boolean;
  bloodCompatibility?: {
    compatible: boolean;
    component: string;
    requiresMedicalCrossmatch: boolean;
  };
}

// ==========================================
// 5. Donation Models
// ==========================================

export interface Donation {
  id: string;
  donorId: string;
  bloodRequestId: string;
  assignmentId?: string | null;
  unitsDonated: number;
  donationDate: string;
  hospitalName: string;
  hospitalAddress: string;
  status: DonationStatus;
  verificationStatus: DonationVerificationStatus;
  notes?: string | null;
  verifiedAt?: string | null;
  verifiedById?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: DonorProfile;
  bloodRequest?: BloodRequest;
  verifiedBy?: Pick<User, "id" | "name" | "email">;
}

export interface DonationHistorySummary {
  totalDonations: number;
  completedDonations: number;
  pendingDonations: number;
  totalUnitsDonated: number;
  lastDonationDate: string | null;
  cooldownEndsAt: string | null;
  isEligible: boolean;
  remainingCooldownDays: number;
}

export interface DonationHistoryResult {
  summary: DonationHistorySummary;
  donations: Donation[];
  pagination?: PaginationMeta;
}

// ==========================================
// 6. Payment Models
// ==========================================

export interface Payment {
  id: string;
  userId: string;
  transactionId: string;
  provider: PaymentProvider;
  paymentPurpose: PaymentPurpose;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentUrl?: string | null;
  description?: string | null;
  bloodRequestId?: string | null;
  refundStatus?: RefundStatus | null;
  refundedAmount?: number | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface PaymentInitiateResult {
  paymentId: string;
  transactionId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentUrl: string;
}

export interface PaymentVerificationResult {
  paymentId: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  paymentPurpose: PaymentPurpose;
  paidAt: string;
  receiptNumber?: string;
}

// ==========================================
// 7. Admin Analytics Models
// ==========================================

export interface AdminAnalytics {
  overview: {
    users: {
      total: number;
      donors: number;
      requesters: number;
      admins: number;
      superAdmins: number;
      active: number;
      blocked: number;
      verified: number;
      unverified: number;
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
      unverified: number;
    };
    bloodRequests: {
      total: number;
      pending: number;
      approved: number;
      matching: number;
      inProgress: number;
      partiallyFulfilled: number;
      fulfilled: number;
      cancelled: number;
      rejected: number;
      expired: number;
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
      pending: number;
      failed: number;
      refunded: number;
      totalSuccessfulAmount: number;
      totalRefundedAmount: number;
      netCollectedAmount: number;
    };
  };
  charts: {
    bloodRequestsByGroup: Array<{
      bloodGroup: BloodGroup;
      count: number;
      units: number;
    }>;
    monthlyTrend: Array<{
      month: string;
      requests: number;
      donations: number;
      donors: number;
    }>;
    urgencyDistribution: Array<{
      urgency: RequestUrgency;
      count: number;
    }>;
    donationsByDistrict: Array<{
      district: string;
      donationsCount: number;
      unitsCount: number;
    }>;
  };
}

// ==========================================
// 8. API Envelope & Pagination Contracts
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: {
    name?: string;
    details?: unknown;
  };
}
