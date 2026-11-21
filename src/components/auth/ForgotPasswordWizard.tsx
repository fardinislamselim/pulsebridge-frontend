"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types";

// Step 1: Request OTP Schema
const requestOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please provide a valid email address"),
});
type RequestOtpFormData = z.infer<typeof requestOtpSchema>;

// Step 2: Verify OTP Schema
const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});
type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

// Step 3: New Password Schema
const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
      .regex(/[a-z]/, "Must include at least 1 lowercase letter")
      .regex(/[0-9]/, "Must include at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

function ForgotPasswordWizardInternal() {
  const router = useRouter();

  // Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [targetEmail, setTargetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form 1: Request OTP
  const formStep1 = useForm<RequestOtpFormData>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: "" },
  });

  // Form 2: Verify OTP
  const formStep2 = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  // Form 3: Reset Password
  const formStep3 = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const passwordValue = formStep3.watch("newPassword", "");

  // Mutation 1: POST /auth/forgot-password
  const requestOtpMutation = useMutation({
    mutationFn: async (data: RequestOtpFormData) => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/auth/forgot-password",
        { email: data.email.trim().toLowerCase() }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      setTargetEmail(variables.email);
      toast.success("Reset Code Sent!", {
        description: `A 6-digit reset OTP has been sent to ${variables.email}.`,
      });
      setCurrentStep(2);
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to process password reset request.";
      toast.error("Request Failed", { description: apiMessage });
    },
  });

  // Mutation 2: POST /auth/verify-reset-otp
  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpFormData) => {
      const response = await apiClient.post<
        ApiResponse<{ email: string; resetToken: string }>
      >("/auth/verify-reset-otp", {
        email: targetEmail.trim().toLowerCase(),
        otp: data.otp.trim(),
      });
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.data?.resetToken;
      if (!token) {
        throw new Error("No reset token returned from verification server");
      }
      setResetToken(token);
      toast.success("Code Verified!", {
        description: "You may now configure a secure new password.",
      });
      setCurrentStep(3);
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid or expired reset code.";
      toast.error("Verification Failed", { description: apiMessage });
    },
  });

  // Mutation 3: POST /auth/reset-password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: NewPasswordFormData) => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/auth/reset-password",
        {
          email: targetEmail.trim().toLowerCase(),
          resetToken,
          newPassword: data.newPassword,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password Reset Successful!", {
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to reset password. Token may have expired.";
      toast.error("Reset Failed", { description: apiMessage });
    },
  });

  // Handlers
  const handleStep1Submit = (data: RequestOtpFormData) => {
    requestOtpMutation.mutate(data);
  };

  const handleStep2Submit = (data: VerifyOtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  const handleStep3Submit = (data: NewPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  // Password checklist states
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="w-full space-y-6">
      {/* Step Indicator Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="uppercase tracking-wider">
            Step {currentStep} of 3
          </span>
          <span className="font-bold text-red-600">
            {currentStep === 1 && "Account Email"}
            {currentStep === 2 && "OTP Code"}
            {currentStep === 3 && "New Password"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* ================= STEP 1: Enter Email ================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your verified email address to receive a 6-digit recovery code.
            </p>
          </div>

          <form
            onSubmit={formStep1.handleSubmit(handleStep1Submit)}
            className="space-y-4"
          >
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
                  placeholder="name@pulsebridge.com"
                  disabled={requestOtpMutation.isPending}
                  {...formStep1.register("email")}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    formStep1.formState.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                />
              </div>
              {formStep1.formState.errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formStep1.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {requestOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Recovery OTP
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= STEP 2: Enter 6-Digit OTP ================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Verify Recovery Code
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter the 6-digit OTP code sent to{" "}
              <strong className="text-slate-900 dark:text-white">
                {targetEmail}
              </strong>
              .
            </p>
          </div>

          <form
            onSubmit={formStep2.handleSubmit(handleStep2Submit)}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="otp"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center mb-2"
              >
                6-Digit OTP Code
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  disabled={verifyOtpMutation.isPending}
                  {...formStep2.register("otp")}
                  className={`w-full rounded-xl border bg-white py-3 text-center font-mono text-2xl font-bold tracking-widest text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    formStep2.formState.errors.otp
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                />
              </div>
              {formStep2.formState.errors.otp && (
                <p className="mt-1.5 flex items-center justify-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formStep2.formState.errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={verifyOtpMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>

              <button
                type="button"
                onClick={() =>
                  requestOtpMutation.mutate({ email: targetEmail })
                }
                disabled={requestOtpMutation.isPending}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Resend code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= STEP 3: Configure New Password ================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Set New Password
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a strong password for your PulseBridge account.
            </p>
          </div>

          <form
            onSubmit={formStep3.handleSubmit(handleStep3Submit)}
            className="space-y-4"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                New Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={resetPasswordMutation.isPending}
                  {...formStep3.register("newPassword")}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    formStep3.formState.errors.newPassword
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
              {formStep3.formState.errors.newPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formStep3.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Confirm New Password
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
                  disabled={resetPasswordMutation.isPending}
                  {...formStep3.register("confirmPassword")}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                    formStep3.formState.errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                  }`}
                />
              </div>
              {formStep3.formState.errors.confirmPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formStep3.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {passwordValue && (
              <div className="rounded-lg bg-slate-100 p-2.5 text-[11px] space-y-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  Password Strength:
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

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Save New Password & Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Return to Sign In */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export function ForgotPasswordWizard() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-red-600 mb-2" />
          <span className="text-xs">Loading password recovery...</span>
        </div>
      }
    >
      <ForgotPasswordWizardInternal />
    </Suspense>
  );
}
