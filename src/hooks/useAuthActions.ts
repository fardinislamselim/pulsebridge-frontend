import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, type LoginPayload, type RegisterPayload, type VerifyEmailPayload } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);
      toast.success(data.message || `Welcome back, ${user.name}!`);

      if (user.role === "REQUESTER") {
        router.push("/requester");
      } else if (user.role === "DONOR") {
        router.push("/donor");
      } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Login failed. Please verify credentials.";
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Registration successful! Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Registration failed. Please check inputs.";
      toast.error(msg);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authService.verifyEmail(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully! You may now sign in.");
      router.push("/login");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Email verification failed. The OTP may be expired.";
      toast.error(msg);
    },
  });
}
