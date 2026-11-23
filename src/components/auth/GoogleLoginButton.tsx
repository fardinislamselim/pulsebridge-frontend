"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function GoogleLoginButton() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      toast.error("Google authentication failed: no credential received.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogleToken(token);
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);
      toast.success(response.message || `Welcome to PulseBridge, ${user.name}!`);

      let targetRoute = "/requester";
      if (user.role === "DONOR") {
        targetRoute = "/donor";
      } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        targetRoute = "/admin";
      }

      router.push(targetRoute);
      router.refresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Google Sign-In failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In window was closed or failed.");
  };

  const clientIdConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      {isLoading ? (
        <div className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-red-600" />
          <span>Authenticating with Google...</span>
        </div>
      ) : clientIdConfigured ? (
        <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:mx-auto">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            shape="rectangular"
            theme="outline"
            text="continue_with"
            size="large"
            width="100%"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await authService.getGoogleAuthUrl();
              if (res.data?.authUrl) {
                window.location.href = res.data.authUrl;
              } else {
                toast.info("Google OAuth Client ID is not configured in environment variables.");
              }
            } catch {
              toast.info("Google OAuth Client ID is not configured in environment variables.");
            }
          }}
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}
    </div>
  );
}
