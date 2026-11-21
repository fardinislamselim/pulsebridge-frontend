"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Droplet,
  HeartHandshake,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Edit3,
  XCircle,
  CheckCircle2,
  Share2,
  Loader2,
  History,
  Users,
  Compass,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import apiClient from "@/lib/axios";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type {
  ApiResponse,
  BloodRequest,
  BloodRequestHistoryItem,
  MatchedEligibleDonor,
  BloodGroup,
  RequestUrgency,
  RequestStatus,
} from "@/types";

const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
  "Jessore",
  "Dinajpur",
  "Tangail",
  "Faridpur",
  "Pabna",
  "Kushtia",
  "Sirajganj",
  "Noakhali",
  "Brahmanbaria",
  "Feni",
  "Jamalpur",
];

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

// Edit schema matching backend requirements
const editRequestSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name must be at least 2 characters").max(100),
  bloodGroup: z.string().min(1, "Please select blood group"),
  unitsNeeded: z.coerce.number().int().min(1, "Minimum 1 unit").max(10, "Maximum 10 units"),
  hospitalName: z.string().trim().min(2, "Hospital name is required").max(150),
  hospitalAddress: z.string().trim().min(3, "Hospital address is required").max(255),
  district: z.string().trim().min(2, "District is required"),
  city: z.string().trim().min(2, "City is required"),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"] as const),
  neededAt: z.string().min(1, "Required date/time is required"),
  contactPerson: z.string().trim().min(2, "Contact person name is required"),
  contactPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Valid phone number required"),
  notes: z.string().trim().max(1000).optional(),
});

type EditFormData = z.infer<typeof editRequestSchema>;

const cancelSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Please provide a valid cancellation reason (min 5 characters)")
    .max(500, "Reason cannot exceed 500 characters"),
});

type CancelFormData = z.infer<typeof cancelSchema>;

interface RequestDetailsClientProps {
  requestId: string;
}

export function RequestDetailsClient({ requestId }: RequestDetailsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 1. Fetch Blood Request Details
  const {
    data: bloodRequest,
    isLoading: isRequestLoading,
    isError: isRequestError,
    refetch: refetchRequest,
  } = useQuery({
    queryKey: ["blood-request", requestId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BloodRequest>>(
        `/blood-requests/${requestId}`
      );
      return res.data.data;
    },
  });

  // 2. Fetch Request History
  const {
    data: history = [],
    isLoading: isHistoryLoading,
  } = useQuery({
    queryKey: ["blood-request-history", requestId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<ApiResponse<BloodRequestHistoryItem[]>>(
          `/blood-requests/${requestId}/history`
        );
        return res.data.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!bloodRequest,
  });

  // 3. Fetch Matched Compatible Donors
  const {
    data: matchedDonors = [],
    isLoading: isDonorsLoading,
  } = useQuery({
    queryKey: ["matched-donors", requestId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<ApiResponse<MatchedEligibleDonor[]>>(
          `/matching/requests/${requestId}/donors`
        );
        return res.data.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!bloodRequest,
  });

  // Edit Request Form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    watch: watchEdit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editRequestSchema),
  });

  // Cancel Request Form
  const {
    register: registerCancel,
    handleSubmit: handleSubmitCancel,
    reset: resetCancel,
    formState: { errors: cancelErrors, isSubmitting: isCancelSubmitting },
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "" },
  });

  // Open Edit Modal with current data
  const handleOpenEdit = () => {
    if (!bloodRequest) return;
    const needed = bloodRequest.neededAt
      ? new Date(bloodRequest.neededAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);

    resetEdit({
      patientName: bloodRequest.patientName,
      bloodGroup: bloodRequest.bloodGroup,
      unitsNeeded: bloodRequest.unitsNeeded,
      hospitalName: bloodRequest.hospitalName,
      hospitalAddress: bloodRequest.hospitalAddress,
      district: bloodRequest.district,
      city: bloodRequest.city,
      urgency: bloodRequest.urgency,
      neededAt: needed,
      contactPerson: bloodRequest.contactName || bloodRequest.requester?.name || "",
      contactPhone: bloodRequest.contactPhone,
      notes: bloodRequest.additionalNotes || bloodRequest.reason || "",
    });
    setIsEditModalOpen(true);
  };

  // Mutation: Update Blood Request
  const updateMutation = useMutation({
    mutationFn: async (formData: EditFormData) => {
      const isoDate = new Date(formData.neededAt).toISOString();
      const payload = {
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        unitsNeeded: formData.unitsNeeded,
        unitsRequired: formData.unitsNeeded,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        district: formData.district,
        city: formData.city,
        urgency: formData.urgency,
        neededAt: isoDate,
        requiredAt: isoDate,
        contactName: formData.contactPerson,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        additionalNotes: formData.notes || undefined,
        reason: formData.notes || undefined,
        details: formData.notes || undefined,
      };

      const res = await apiClient.patch<ApiResponse<BloodRequest>>(
        `/blood-requests/${requestId}`,
        payload
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Blood request updated successfully!");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["blood-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["blood-request-history", requestId] });
      queryClient.invalidateQueries({ queryKey: ["matched-donors", requestId] });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message || "Failed to update blood request. Please check inputs.";
      toast.error(errorMsg);
    },
  });

  // Mutation: Cancel Blood Request
  const cancelMutation = useMutation({
    mutationFn: async (data: CancelFormData) => {
      const res = await apiClient.patch<ApiResponse<BloodRequest>>(
        `/blood-requests/${requestId}/cancel`,
        { reason: data.reason }
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Blood request cancelled successfully.");
      setIsCancelModalOpen(false);
      resetCancel();
      queryClient.invalidateQueries({ queryKey: ["blood-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["blood-request-history", requestId] });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message || "Failed to cancel request. Please try again.";
      toast.error(errorMsg);
    },
  });

  // Share Request Link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Request link copied to clipboard!");
    }
  };

  // Loading Skeleton
  if (isRequestLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isRequestError || !bloodRequest) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <AlertOctagon className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
        <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
          Blood Request Not Found
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          The requested emergency case could not be retrieved, or you may lack permission to view it.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/requester"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => refetchRequest()}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const isTerminalState =
    bloodRequest.status === "FULFILLED" ||
    bloodRequest.status === "CANCELLED" ||
    bloodRequest.status === "EXPIRED" ||
    bloodRequest.status === "REJECTED";

  const unitsNeeded = bloodRequest.unitsNeeded || 1;
  const unitsFulfilled = bloodRequest.unitsFulfilled || 0;
  const fulfillmentPercent = Math.min(
    100,
    Math.round((unitsFulfilled / unitsNeeded) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/requester"
              className="hover:text-red-600 dark:hover:text-red-400 transition"
            >
              Requester Portal
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[200px]">
              {bloodRequest.patientName}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Case #{bloodRequest.id.slice(-6).toUpperCase()}
            </h1>
            <BloodGroupBadge bloodGroup={bloodRequest.bloodGroup} size="lg" />
            <StatusBadge status={bloodRequest.status} />
            <StatusBadge status={bloodRequest.urgency} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>

          {!isTerminalState && (
            <>
              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                Edit Details
              </button>

              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100/60 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 transition"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel
              </button>
            </>
          )}

          <Link
            href={`/requester/donations/log?requestId=${bloodRequest.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition"
          >
            <HeartHandshake className="h-4 w-4" />
            Record Donation
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Metadata & Matched Donors */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card: Patient & Clinical Requirement */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Patient & Hospital Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical requirements and contact coordinates
                  </p>
                </div>
              </div>

              {/* Progress Pill */}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {unitsFulfilled} / {unitsNeeded} Units
                </span>
                <span className="ml-1 text-xs text-slate-500">({fulfillmentPercent}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  fulfillmentPercent >= 100
                    ? "bg-emerald-500"
                    : fulfillmentPercent > 0
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${fulfillmentPercent}%` }}
              />
            </div>

            {/* Metadata Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">Patient Name</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {bloodRequest.patientName}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">Hospital</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {bloodRequest.hospitalName}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                    {bloodRequest.hospitalAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">District & Area</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {bloodRequest.district}, {bloodRequest.city}
                  </span>
                  {bloodRequest.area && (
                    <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                      {bloodRequest.area}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">Needed Deadline</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(bloodRequest.neededAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                    {new Date(bloodRequest.neededAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">Emergency Contact</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {bloodRequest.contactName || bloodRequest.requester?.name || "Primary Contact"}
                  </span>
                  <a
                    href={`tel:${bloodRequest.contactPhone}`}
                    className="text-red-600 dark:text-red-400 font-semibold block text-xs mt-0.5 hover:underline"
                  >
                    {bloodRequest.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-medium">Submitted On</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(bloodRequest.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Details / Notes */}
            {(bloodRequest.additionalNotes || bloodRequest.reason) && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Clinical Instructions / Notes
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {bloodRequest.additionalNotes || bloodRequest.reason}
                </p>
              </div>
            )}
          </div>

          {/* Matched Compatible Donors Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Matched Eligible Donors
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {matchedDonors.length} Found
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automated ABO/Rh compatible donors within proximity
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Auto-Matched by System
              </div>
            </div>

            {/* Donors List */}
            {isDonorsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : matchedDonors.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                <Users className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Searching for Compatible Donors
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  Our matching engine is actively scanning verified donors in {bloodRequest.district} with compatible blood. Ensure your request urgency is accurate to prioritize dispatch.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Broadcast Public Appeal
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedDonors.map((donor) => (
                  <div
                    key={donor.donorId}
                    className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {donor.donorName || "Verified Blood Donor"}
                            </span>
                            {donor.isVerified && (
                              <span title="Verified Donor" className="inline-flex">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>
                              {donor.city ? `${donor.city}, ` : ""}
                              {donor.district || "Registered District"}
                            </span>
                          </div>
                        </div>

                        <BloodGroupBadge bloodGroup={donor.donorBloodGroup} size="sm" />
                      </div>

                      {/* Distance & Availability Badges */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {donor.distanceKm !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                            <Compass className="h-3 w-3" />
                            {donor.distanceKm < 1
                              ? "Nearby (< 1 km)"
                              : `${donor.distanceKm.toFixed(1)} km away`}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                            donor.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                          }`}
                        >
                          {donor.isAvailable ? "Available to Donate" : "Recently Active"}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        ABO Crossmatch Compatible
                      </span>
                      <Link
                        href={`/requester/donations/log?requestId=${bloodRequest.id}&donorProfileId=${donor.donorId}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/20 hover:bg-red-700 transition"
                      >
                        <HeartHandshake className="h-3.5 w-3.5" />
                        Log Donation
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Urgency Callout & Audit Timeline */}
        <div className="space-y-6">
          {/* Urgency Box */}
          <div
            className={`rounded-2xl border p-5 ${
              bloodRequest.urgency === "EMERGENCY"
                ? "border-red-300 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100"
                : bloodRequest.urgency === "URGENT"
                ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100"
                : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {bloodRequest.urgency === "EMERGENCY" ? (
                <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )}
              <h3 className="font-bold text-sm">
                Priority: {bloodRequest.urgency} DISPATCH
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {bloodRequest.urgency === "EMERGENCY"
                ? "Automated SMS/Push emergency alerts are actively broadcast to all verified donors within the district radius."
                : "High-priority coordination queue with automated matching across verified public blood donors."}
            </p>
            <div className="mt-4 pt-3 border-t border-red-200/60 dark:border-red-900/40 text-xs flex justify-between items-center">
              <span className="font-medium">Need Assistance?</span>
              <a
                href="tel:999"
                className="font-bold text-red-600 hover:underline dark:text-red-400"
              >
                Call Hotline 999
              </a>
            </div>
          </div>

          {/* Audit Status Timeline */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Audit Lifecycle Timeline
                </h3>
                <p className="text-[11px] text-slate-400">
                  Immutable audit records of state transitions
                </p>
              </div>
            </div>

            {isHistoryLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-2.5 w-40 bg-slate-100 dark:bg-slate-900 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="space-y-4 text-xs">
                {/* Fallback Initial Event if history API returned empty */}
                <div className="relative pl-6 pb-2 border-l-2 border-slate-200 dark:border-slate-800">
                  <div className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-red-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Request Initiated
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Status: {bloodRequest.status}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {new Date(bloodRequest.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4 text-xs">
                {history.map((event, idx) => {
                  const isLatest = idx === history.length - 1;
                  return (
                    <div key={event.id || idx} className="relative group">
                      <div
                        className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                          isLatest
                            ? "bg-red-600 animate-ping-once"
                            : "bg-slate-400 dark:bg-slate-600"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {event.action.replace(/_/g, " ")}
                          </span>
                          {event.newStatus && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {event.newStatus}
                            </span>
                          )}
                        </div>

                        {event.reason && (
                          <p className="mt-1 text-slate-600 dark:text-slate-300 italic">
                            &quot;{event.reason}&quot;
                          </p>
                        )}

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span>
                            {new Date(event.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          {event.actor?.name && (
                            <>
                              <span>•</span>
                              <span>By {event.actor.name} ({event.actor.role})</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Request Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Edit3 className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Blood Request Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit((data) => updateMutation.mutateAsync(data))}
              className="mt-5 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    {...registerEdit("patientName")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.patientName && (
                    <p className="mt-1 text-red-600">{editErrors.patientName.message}</p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Blood Group *
                  </label>
                  <select
                    {...registerEdit("bloodGroup")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  >
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                      </option>
                    ))}
                  </select>
                  {editErrors.bloodGroup && (
                    <p className="mt-1 text-red-600">{editErrors.bloodGroup.message}</p>
                  )}
                </div>

                {/* Units Needed */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Units Needed (1 - 10) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    {...registerEdit("unitsNeeded")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.unitsNeeded && (
                    <p className="mt-1 text-red-600">{editErrors.unitsNeeded.message}</p>
                  )}
                </div>

                {/* Urgency */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Urgency Level *
                  </label>
                  <select
                    {...registerEdit("urgency")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="URGENT">Urgent Priority</option>
                    <option value="EMERGENCY">Emergency Critical</option>
                  </select>
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    {...registerEdit("hospitalName")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.hospitalName && (
                    <p className="mt-1 text-red-600">{editErrors.hospitalName.message}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    District *
                  </label>
                  <select
                    {...registerEdit("district")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    City / Sub-district *
                  </label>
                  <input
                    type="text"
                    {...registerEdit("city")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.city && (
                    <p className="mt-1 text-red-600">{editErrors.city.message}</p>
                  )}
                </div>

                {/* Required At */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Required Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...registerEdit("neededAt")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.neededAt && (
                    <p className="mt-1 text-red-600">{editErrors.neededAt.message}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    {...registerEdit("contactPerson")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.contactPerson && (
                    <p className="mt-1 text-red-600">{editErrors.contactPerson.message}</p>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="text"
                    {...registerEdit("contactPhone")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                  {editErrors.contactPhone && (
                    <p className="mt-1 text-red-600">{editErrors.contactPhone.message}</p>
                  )}
                </div>
              </div>

              {/* Hospital Address */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Hospital Address *
                </label>
                <input
                  type="text"
                  {...registerEdit("hospitalAddress")}
                  className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
                {editErrors.hospitalAddress && (
                  <p className="mt-1 text-red-600">{editErrors.hospitalAddress.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical Notes / Special Requirements
                </label>
                <textarea
                  rows={3}
                  {...registerEdit("notes")}
                  className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:opacity-60"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Request Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cancel Blood Request
                </h3>
                <p className="text-xs text-slate-500">
                  Case #{bloodRequest.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cancelling this request will immediately stop emergency broadcasts to matched donors and halt active matching algorithms.
            </p>

            <form
              onSubmit={handleSubmitCancel((data) => cancelMutation.mutateAsync(data))}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Blood arranged from hospital bank, patient surgery postponed, etc."
                  {...registerCancel("reason")}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
                {cancelErrors.reason && (
                  <p className="mt-1 text-xs text-red-600">{cancelErrors.reason.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={cancelMutation.isPending}
                  onClick={() => setIsCancelModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-600/30 hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
