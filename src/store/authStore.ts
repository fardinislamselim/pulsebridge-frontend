import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User, UserRole } from "@/types";
import { tokenStorage } from "@/lib/axios";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user: User, accessToken: string, refreshToken?: string) => {
        // 1. Sync tokens with axios memory/localStorage storage
        tokenStorage.setAccessToken(accessToken);
        if (refreshToken) {
          tokenStorage.setRefreshToken(refreshToken);
        }

        // 2. Sync cookies for Next.js Edge Middleware
        Cookies.set("accessToken", accessToken, {
          expires: 7, // 7 days
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        Cookies.set("userRole", user.role, {
          expires: 7,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        // 3. Update Zustand Store State
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateUser: (partialUser: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updated = { ...currentUser, ...partialUser };

        if (partialUser.role) {
          Cookies.set("userRole", partialUser.role, {
            expires: 7,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        set({ user: updated });
      },

      logout: () => {
        // Clear all cookies
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("userRole", { path: "/" });

        // Clear local storage and memory tokens
        tokenStorage.clearAll();
        try {
          localStorage.removeItem("pulsebridge_auth_store");
        } catch {}

        // Reset state
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initializeFromStorage: () => {
        const cookieToken = Cookies.get("accessToken");
        const storedToken = tokenStorage.getAccessToken();
        const activeToken = cookieToken || storedToken;
        const currentUser = get().user;

        if (activeToken && currentUser) {
          // Sync tokens if only one was present
          if (!cookieToken && activeToken) {
            Cookies.set("accessToken", activeToken, { path: "/", sameSite: "lax" });
          }
          if (!storedToken && activeToken) {
            tokenStorage.setAccessToken(activeToken);
          }
          set({
            accessToken: activeToken,
            isAuthenticated: true,
          });
        } else {
          // When no active token exists, purge stale user and state completely
          tokenStorage.clearAll();
          try {
            localStorage.removeItem("pulsebridge_auth_store");
          } catch {}
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "pulsebridge_auth_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
