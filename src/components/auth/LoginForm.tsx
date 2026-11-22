"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { DemoLoginButtons } from "@/components/auth/DemoLoginButtons";

const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);
      toast.success(response.message || `Welcome back, ${user.name}!`);

      let target = "/requester";
      if (user.role === "DONOR") target = "/donor";
      else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") target = "/admin";

      router.push(target);
      router.refresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed. Please verify credentials.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              {...register("email")}
              className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                errors.email ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-red-600 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Password *</label>
            <Link href="/forgot-password" className="text-red-600 hover:underline dark:text-red-400 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isSubmitting}
              {...register("password")}
              className={`w-full rounded-xl border pl-9 pr-10 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                errors.password ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-red-600 font-medium">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:opacity-70 transition"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In to PulseBridge
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <AuthDivider />

      <GoogleLoginButton />

      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400"
        >
          Register now
        </Link>
      </div>

      <DemoLoginButtons />
    </div>
  );
}
