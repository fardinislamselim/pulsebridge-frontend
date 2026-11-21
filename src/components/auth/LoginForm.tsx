"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useAuthActions";
import { DemoLoginButtons, type DemoAccount } from "@/components/auth/DemoLoginButtons";

const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [selectedDemoEmail, setSelectedDemoEmail] = useState<string>("");
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleDemoLogin = (account: DemoAccount) => {
    setSelectedDemoEmail(account.email);
    setValue("email", account.email);
    setValue("password", account.password);
    loginMutation.mutate({ email: account.email, password: account.password });
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
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                errors.password ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
          </div>
          {errors.password && <p className="mt-1 text-red-600 font-medium">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:opacity-70 transition"
        >
          {loginMutation.isPending && !selectedDemoEmail ? (
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

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="bg-white px-3 text-[11px] font-bold uppercase text-slate-400 dark:bg-slate-900">
          Or Quick Demo Login
        </span>
      </div>

      <DemoLoginButtons
        onSelectAccount={handleDemoLogin}
        isLoading={loginMutation.isPending}
        selectedEmail={selectedDemoEmail}
      />
    </div>
  );
}
