"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useVerifyEmail } from "@/hooks/useAuthActions";
import { authService } from "@/services/auth.service";

function VerifyEmailFormInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [isEditingEmail, setIsEditingEmail] = useState(!emailFromUrl);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update email if query param changes
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      setIsEditingEmail(false);
    }
  }, [emailFromUrl]);

  // 60-Second Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, countdown]);

  // Handle single digit input and auto-focus next
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");

    // If user pastes multiple digits
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      chars.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join("");

  // Mutation: Verify Email OTP
  const verifyMutation = useVerifyEmail();

  // Mutation: Resend Verification OTP
  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) {
        throw new Error("Please specify your email address first");
      }

      return authService.resendVerificationOtp({
        email: email.trim().toLowerCase(),
      });
    },
    onSuccess: () => {
      toast.success("New OTP Sent!", {
        description: `A fresh 6-digit OTP code has been delivered to ${email}.`,
      });
      setCountdown(60);
      setIsTimerActive(true);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Failed to resend verification OTP. Please try again later.";
      toast.error("Resend Failed", {
        description: apiMessage,
      });
    },
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP code");
      return;
    }
    verifyMutation.mutate({ email: email.trim().toLowerCase(), otp: fullOtp });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <Mail className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Verify Your Email
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We have sent a 6-digit confirmation code to your email address.
        </p>
      </div>

      {/* Email Display & Edit option */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">
            Target Email
          </span>
          <button
            type="button"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            {isEditingEmail ? "Done" : "Change Email"}
          </button>
        </div>

        {isEditingEmail ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        ) : (
          <div className="mt-1 font-mono text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {email || "No email specified"}
          </div>
        )}
      </div>

      {/* OTP Inputs */}
      <form onSubmit={handleVerifySubmit} className="space-y-6">
        <div>
          <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Enter 6-Digit OTP Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={verifyMutation.isPending}
                className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-slate-300 bg-white text-center font-mono text-xl sm:text-2xl font-bold text-slate-900 transition focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={verifyMutation.isPending || fullOtp.length !== 6 || !email}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying Code...
            </>
          ) : (
            <>
              Verify & Activate Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Didn&apos;t receive the confirmation email?
        </div>

        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={isTimerActive || resendMutation.isPending || !email}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 transition hover:text-red-700 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
        >
          {resendMutation.isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending New OTP...
            </>
          ) : isTimerActive ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Resend code in {countdown}s
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Resend 6-Digit OTP Now
            </>
          )}
        </button>
      </div>

      {/* Return to Sign In */}
      <div className="text-center text-xs text-slate-500">
        Already verified?{" "}
        <Link
          href="/login"
          className="font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          Sign In to your account
        </Link>
      </div>
    </div>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-3" />
          <span className="text-sm">Loading email verification...</span>
        </div>
      }
    >
      <VerifyEmailFormInternal />
    </Suspense>
  );
}
