"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse, AuthResponse, UserRole } from "@/types";

// Zod validation schema for login credentials
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface DemoAccount {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  description: string;
  targetPath: string;
  badgeColor: string;
  borderHover: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "REQUESTER",
    title: "Requester Portal",
    name: "Alice Rahman",
    email: "recipient.alice@pulsebridge.com",
    password: "DemoPassword123!",
    badge: "Requester",
    description: "Create requests, find matching donors & log donations",
    targetPath: "/requester",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
    borderHover: "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
  },
  {
    role: "DONOR",
    title: "Donor Hub",
    name: "John Doe",
    email: "donor.john@pulsebridge.com",
    password: "DemoPassword123!",
    badge: "Donor",
    description: "Live availability toggle & 90-day cooldown countdown",
    targetPath: "/donor",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    borderHover: "hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
  },
  {
    role: "ADMIN",
    title: "Admin Governance",
    name: "System Admin",
    email: "admin@pulsebridge.com",
    password: "AdminPassword123!",
    badge: "Admin",
    description: "Recharts analytics, request moderation & payment audits",
    targetPath: "/admin",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    borderHover: "hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
  },
];

function LoginFormInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const setAuth = useAuthStore((state) => state.setAuth);

  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TanStack Query Mutation for Authentication
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      const authData = data.data;
      if (!authData || !authData.user || !authData.accessToken) {
        throw new Error("Invalid response from authentication server");
      }

      // 1. Sync tokens & cookies via Zustand authStore
      setAuth(authData.user, authData.accessToken, authData.refreshToken);

      toast.success(
        `Welcome to PulseBridge, ${authData.user.name || "User"}!`,
        {
          description: `Logged in as ${authData.user.role}. Redirecting to your dashboard...`,
        }
      );

      // 2. Determine target redirection based on user role
      let destination = "/";
      if (authData.user.role === "REQUESTER") destination = "/requester";
      else if (authData.user.role === "DONOR") destination = "/donor";
      else if (
        authData.user.role === "ADMIN" ||
        authData.user.role === "SUPER_ADMIN"
      ) {
        destination = "/admin";
      }

      // Respect valid role-matching redirect parameter if present
      if (redirectParam && redirectParam.startsWith("/")) {
        if (
          (authData.user.role === "REQUESTER" && redirectParam.startsWith("/requester")) ||
          (authData.user.role === "DONOR" && redirectParam.startsWith("/donor")) ||
          (authData.user.role === "ADMIN" || authData.user.role === "SUPER_ADMIN")
        ) {
          destination = redirectParam;
        }
      }

      router.push(destination);
      router.refresh();
    },
    onError: (error: unknown) => {
      setActiveDemoRole(null);
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid email or password. Please try again.";
      toast.error("Authentication Failed", {
        description: apiMessage,
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setActiveDemoRole(null);
    loginMutation.mutate(data);
  };

  const handleDemoLogin = (demo: DemoAccount) => {
    setActiveDemoRole(demo.role);
    setValue("email", demo.email);
    setValue("password", demo.password);
    loginMutation.mutate({
      email: demo.email,
      password: demo.password,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to manage blood requests or donor availability.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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
              disabled={loginMutation.isPending}
              {...register("email")}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
              {...register("password")}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white transition ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loginMutation.isPending && !activeDemoRole ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign In to Dashboard
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider: OR Quick Demo Login */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 dark:bg-slate-950 px-3 font-semibold text-slate-500 tracking-wider">
            Or Quick Demo Login
          </span>
        </div>
      </div>

      {/* 3 Distinct One-Click Demo Login Cards */}
      <div className="space-y-2.5">
        {DEMO_ACCOUNTS.map((demo) => {
          const isSelected =
            activeDemoRole === demo.role && loginMutation.isPending;

          return (
            <button
              key={demo.role}
              type="button"
              disabled={loginMutation.isPending}
              onClick={() => handleDemoLogin(demo)}
              className={`w-full text-left rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-900 ${demo.borderHover} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${demo.badgeColor}`}
                  >
                    {demo.badge}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {demo.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  {isSelected ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>1-Click Login</span>
                    </>
                  )}
                </div>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {demo.description}
              </p>

              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>{demo.email}</span>
                <span>•</span>
                <span>DemoPassword123!</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Link to Register */}
      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400"
        >
          Register as Donor or Requester
        </Link>
      </div>
    </div>
  );
}

/**
 * LoginForm - Client Component
 * Wrapped in Suspense to safely isolate search params and client hooks.
 */
export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-red-600 mr-2" />
          Loading authentication form...
        </div>
      }
    >
      <LoginFormInternal />
    </Suspense>
  );
}
