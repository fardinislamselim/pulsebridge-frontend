"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  HeartHandshake,
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  User,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Info,
  Droplet,
  ArrowRight,
} from "lucide-react";

import { useCreateDonation } from "@/hooks/useDonations";
import { useBloodRequestDetails } from "@/hooks/useBloodRequests";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { BloodRequest } from "@/types";

const logDonationSchema = z.object({
  bloodRequestId: z
    .string()
    .trim()
    .min(1, "Blood request ID is required"),
  donorProfileId: z
    .string()
    .trim()
    .min(1, "Donor profile ID or User ID is required"),
  unitsDonated: z.coerce
    .number()
    .int("Units must be a whole number")
    .min(1, "Minimum 1 unit")
    .max(10, "Maximum 10 units per donation entry"),
  hospitalName: z
    .string()
    .trim()
    .min(2, "Hospital name must be at least 2 characters")
    .max(255),
  hospitalAddress: z.string().trim().max(500).optional(),
  donationDate: z.string().min(1, "Donation date and time is required"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
});

type LogDonationFormData = z.infer<typeof logDonationSchema>;

export function LogDonationForm() {
  const searchParams = useSearchParams();

  const queryRequestId = searchParams.get("requestId") || searchParams.get("bloodRequestId") || "";
  const queryDonorId = searchParams.get("donorProfileId") || searchParams.get("donorId") || "";

  // Current local ISO string for datetime-local
  const getDefaultDatetime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LogDonationFormData>({
    resolver: zodResolver(logDonationSchema),
    defaultValues: {
      bloodRequestId: queryRequestId,
      donorProfileId: queryDonorId,
      unitsDonated: 1,
      hospitalName: "",
      hospitalAddress: "",
      donationDate: getDefaultDatetime(),
      notes: "",
    },
  });

  const selectedRequestId = watch("bloodRequestId");

  // Fetch Blood Request details if ID is present
  const { data: bloodRequest } = useBloodRequestDetails(selectedRequestId);

  // Pre-fill hospital name and address when blood request data loads
  useEffect(() => {
    if (bloodRequest) {
      if (bloodRequest.hospitalName) {
        setValue("hospitalName", bloodRequest.hospitalName);
      }
      if (bloodRequest.hospitalAddress) {
        setValue("hospitalAddress", bloodRequest.hospitalAddress);
      }
    }
  }, [bloodRequest, setValue]);

  // Mutation: POST /donations
  const logDonationMutation = useCreateDonation();

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href={selectedRequestId ? `/requester/requests/${selectedRequestId}` : "/requester"}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {selectedRequestId ? "Back to Request Details" : "Back to Requester Portal"}
        </Link>
      </div>

      {/* Associated Request Summary Preview */}
      {bloodRequest && (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <Droplet className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Target Emergency Case
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {bloodRequest.patientName}
                  </h3>
                  <BloodGroupBadge bloodGroup={bloodRequest.bloodGroup} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {bloodRequest.hospitalName} • {bloodRequest.district}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-500 block">Fulfillment Progress</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {bloodRequest.unitsFulfilled || 0} / {bloodRequest.unitsNeeded} Units Received
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Administrator Verification Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              Official Medical Verification Notice
            </h4>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
              All blood donation entries logged by requesters will remain in{" "}
              <strong className="underline font-semibold">PENDING</strong> verification status until authenticated by a PulseBridge clinical administrator.
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-[11px] pt-1">
              • Once verified, the donation count will immediately increment your request&apos;s fulfilled units.
              <br />
              • The donor will receive official credit and their mandatory 90-day medical cooldown will begin.
            </p>
          </div>
        </div>
      </div>

      {/* Main Logging Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form
          onSubmit={handleSubmit((data) =>
            logDonationMutation.mutateAsync({
              ...data,
              donorId: data.donorProfileId,
            })
          )}
          className="space-y-6 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Blood Request ID */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Request ID *
              </label>
              <input
                type="text"
                placeholder="e.g., req_cm3..."
                {...register("bloodRequestId")}
                className={`w-full rounded-xl border p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                  errors.bloodRequestId
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              {errors.bloodRequestId && (
                <p className="mt-1 text-red-600 font-medium">
                  {errors.bloodRequestId.message}
                </p>
              )}
            </div>

            {/* Donor Profile ID */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Donor Profile ID / User ID *
              </label>
              <input
                type="text"
                placeholder="e.g., dnr_cm3... or donor user ID"
                {...register("donorProfileId")}
                className={`w-full rounded-xl border p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                  errors.donorProfileId
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              {errors.donorProfileId && (
                <p className="mt-1 text-red-600 font-medium">
                  {errors.donorProfileId.message}
                </p>
              )}
            </div>

            {/* Units Donated */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Units of Blood Donated *
              </label>
              <input
                type="number"
                min={1}
                max={10}
                {...register("unitsDonated")}
                className={`w-full rounded-xl border p-3 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                  errors.unitsDonated
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              {errors.unitsDonated && (
                <p className="mt-1 text-red-600 font-medium">
                  {errors.unitsDonated.message}
                </p>
              )}
            </div>

            {/* Donation Date */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Donation Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register("donationDate")}
                className={`w-full rounded-xl border p-3 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                  errors.donationDate
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              {errors.donationDate && (
                <p className="mt-1 text-red-600 font-medium">
                  {errors.donationDate.message}
                </p>
              )}
            </div>

            {/* Hospital Name */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Hospital / Transfusion Center Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Dhaka Medical College Hospital"
                {...register("hospitalName")}
                className={`w-full rounded-xl border p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                  errors.hospitalName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              {errors.hospitalName && (
                <p className="mt-1 text-red-600 font-medium">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>

            {/* Hospital Address */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Hospital Address (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Blood Transfusion Unit, Ward 3B"
                {...register("hospitalAddress")}
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-red-600 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white transition"
              />
            </div>
          </div>

          {/* Notes / Blood Bag Barcode */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Donation Notes & Verification Reference (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Blood bag barcode #B-89211, donor card receipt presented, doctor in charge Dr. Rahman."
              {...register("notes")}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-red-600 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white transition"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 text-center sm:text-left">
              Verification status: <strong className="text-amber-600 font-semibold">PENDING ADMIN APPROVAL</strong>
            </span>

            <button
              type="submit"
              disabled={logDonationMutation.isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 transition"
            >
              {logDonationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging Donation...
                </>
              ) : (
                <>
                  Submit Donation Record
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
