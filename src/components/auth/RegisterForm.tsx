"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Heart,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Droplet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import apiClient from "@/lib/axios";
import type { ApiResponse, BloodGroup, UserRole } from "@/types";

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

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
  .regex(/[a-z]/, "Must include at least 1 lowercase letter")
  .regex(/[0-9]/, "Must include at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character");

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number (e.g. +8801700000000)"),
    role: z.enum(["REQUESTER", "DONOR"] as const),
    bloodGroup: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (data.role === "DONOR") {
      if (!data.bloodGroup) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Blood group is required for voluntary donors",
          path: ["bloodGroup"],
        });
      }
      if (!data.district || data.district.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "District is required for donor emergency dispatch",
          path: ["district"],
        });
      }
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterFormInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole =
    searchParams.get("role")?.toUpperCase() === "DONOR" ? "DONOR" : "REQUESTER";

  const [selectedRole, setSelectedRole] = useState<"REQUESTER" | "DONOR">(
    defaultRole
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      bloodGroup: "",
      district: "",
      city: "",
      address: "",
    },
  });

  const passwordValue = watch("password", "");

  useEffect(() => {
    setValue("role", selectedRole);
  }, [selectedRole, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
      };

      if (data.role === "DONOR") {
        payload.bloodGroup = data.bloodGroup;
        payload.district = data.district;
        if (data.city) payload.city = data.city;
        if (data.address) payload.address = data.address;
      }

      const response = await apiClient.post<ApiResponse<unknown>>(
        "/auth/register",
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Account created successfully!", {
        description: `A 6-digit OTP has been sent to ${variables.email}. Please verify your account.`,
      });
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create account. Please verify your details.";
      toast.error("Registration Failed", {
        description: apiMessage,
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  // Password requirements checklist
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create PulseBridge Account
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Join our 24/7 blood coordination and emergency network.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          I want to register as
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole("REQUESTER")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
              selectedRole === "REQUESTER"
                ? "border-red-600 bg-red-50/70 text-red-900 shadow-sm dark:bg-red-950/40 dark:text-red-200 dark:border-red-600"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <User className="h-4 w-4" />
              Requester
            </div>
            <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Request blood for patients & hospitals
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("DONOR")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
              selectedRole === "DONOR"
                ? "border-red-600 bg-red-50/70 text-red-900 shadow-sm dark:bg-red-950/40 dark:text-red-200 dark:border-red-600"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <Droplet className="h-4 w-4 text-red-600" />
              Voluntary Donor
            </div>
            <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Donate blood & respond to emergencies
            </span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              autoComplete="name"
              placeholder="Alice Rahman"
              disabled={registerMutation.isPending}
              {...register("name")}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
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

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="alice@example.com"
                disabled={registerMutation.isPending}
                {...register("email")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

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
                autoComplete="tel"
                placeholder="+8801700000000"
                disabled={registerMutation.isPending}
                {...register("phone")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
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

        {/* Dynamic Fields for DONOR Role */}
        {selectedRole === "DONOR" && (
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 space-y-4 dark:border-red-900/60 dark:bg-red-950/20 transition-all">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-300">
              <Droplet className="h-4 w-4 text-red-600" />
              Donor Medical & Geographic Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Blood Group <span className="text-red-600">*</span>
                </label>
                <select
                  id="bloodGroup"
                  disabled={registerMutation.isPending}
                  {...register("bloodGroup")}
                  className={`mt-1.5 w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    errors.bloodGroup
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg.value} value={bg.value}>
                      {bg.label} ({bg.value.replace("_", " ")})
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  District <span className="text-red-600">*</span>
                </label>
                <select
                  id="district"
                  disabled={registerMutation.isPending}
                  {...register("district")}
                  className={`mt-1.5 w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    errors.district
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                >
                  <option value="">Select district</option>
                  {BANGLADESH_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            {/* Optional City & Area */}
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                City / Thana (Optional)
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  id="city"
                  type="text"
                  placeholder="Dhanmondi, Dhaka"
                  disabled={registerMutation.isPending}
                  {...register("city")}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={registerMutation.isPending}
                {...register("password")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Confirm Password
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={registerMutation.isPending}
                {...register("confirmPassword")}
                className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {passwordValue && (
          <div className="rounded-lg bg-slate-100 p-2.5 text-[11px] space-y-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <div className="font-semibold text-slate-700 dark:text-slate-200">
              Password Requirements:
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span
                className={`flex items-center gap-1 ${
                  hasMinLength ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> 8+ Characters
              </span>
              <span
                className={`flex items-center gap-1 ${
                  hasUppercase ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> 1 Uppercase Letter
              </span>
              <span
                className={`flex items-center gap-1 ${
                  hasLowercase ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> 1 Lowercase Letter
              </span>
              <span
                className={`flex items-center gap-1 ${
                  hasNumber ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> 1 Number
              </span>
              <span
                className={`flex items-center gap-1 ${
                  hasSpecial ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> 1 Special Character
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create PulseBridge Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400"
        >
          Sign In here
        </Link>
      </div>
    </div>
  );
}

export function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-red-600 mr-2" />
          Loading registration form...
        </div>
      }
    >
      <RegisterFormInternal />
    </Suspense>
  );
}
