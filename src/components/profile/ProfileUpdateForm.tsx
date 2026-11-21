"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  Loader2,
  AlertCircle,
  MapPin,
  Droplet,
  Calendar,
} from "lucide-react";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { ApiResponse, User as UserType, BloodGroup } from "@/types";

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

const BLOOD_GROUPS: { label: string; value: BloodGroup }[] = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Please provide a valid phone number (e.g. +8801700000000)")
    .optional()
    .or(z.literal("")),
  district: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileUpdateForm() {
  const queryClient = useQueryClient();
  const updateUserStore = useAuthStore((state) => state.updateUser);

  // Fetch Current User Profile
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await userService.getMe();
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      district: "",
      city: "",
      address: "",
      bloodGroup: "",
    },
  });

  // Populate form with fetched data
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        phone: data.phone || "",
        district: data.donorProfile?.district || "",
        city: data.donorProfile?.city || "",
        address: data.donorProfile?.address || "",
        bloodGroup: data.donorProfile?.bloodGroup || "",
      });
    }
  }, [data, reset]);

  // Mutation: PATCH /users/me
  const updateMutation = useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const response = await userService.updateMe({
        name: formData.name,
        phone: formData.phone || undefined,
      });
      return response.data;
    },
    onSuccess: (updated) => {
      toast.success("Profile Updated!", {
        description: "Your account details have been safely updated.",
      });
      updateUserStore({
        name: updated.name,
        phone: updated.phone,
      });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err: unknown) => {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update profile. Please try again.";
      toast.error("Update Failed", { description: apiMessage });
    },
  });

  const onSubmit = (formData: ProfileFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <FormSkeleton fields={4} columns={2} showButtons={true} />;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
        <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
        Failed to load profile. Please verify your authentication.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header with Role & Verification Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-xl font-extrabold text-white shadow-md shadow-red-600/30">
            {data.name ? data.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              {data.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {data.role}
              </span>
              {data.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">
                  Unverified Email
                </span>
              )}
            </div>
          </div>
        </div>

        {data.donorProfile?.bloodGroup && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Registered Group:</span>
            <BloodGroupBadge bloodGroup={data.donorProfile.bloodGroup} size="md" />
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Full Name
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                disabled={updateMutation.isPending}
                {...register("name")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Phone Number
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="+8801700000000"
                disabled={updateMutation.isPending}
                {...register("phone")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Read-Only Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Email Address (Primary Identifier)
          </label>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              disabled
              value={data.email}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Email addresses are cryptographically tied to audit logs and cannot be altered directly.
          </p>
        </div>

        {/* Location & Donor Specific Fields */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <MapPin className="h-4 w-4 text-red-600" />
            Location & Geographic Availability
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="district"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                District
              </label>
              <select
                id="district"
                disabled={updateMutation.isPending}
                {...register("district")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="">Select district</option>
                {BANGLADESH_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                City / Thana
              </label>
              <input
                id="city"
                type="text"
                placeholder="Dhanmondi, Dhaka"
                disabled={updateMutation.isPending}
                {...register("city")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Street Address (Optional)
            </label>
            <input
              id="address"
              type="text"
              placeholder="House 12, Road 4, Sector 3"
              disabled={updateMutation.isPending}
              {...register("address")}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
