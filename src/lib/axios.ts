import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Extended configuration to track retried requests
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Queue for handling multiple concurrent 401s during token refresh
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Safe storage access for SSR/Client
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pulsebridge_access_token");
  },
  setAccessToken: (token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("pulsebridge_access_token", token);
    } else {
      localStorage.removeItem("pulsebridge_access_token");
    }
  },
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pulsebridge_refresh_token");
  },
  setRefreshToken: (token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("pulsebridge_refresh_token", token);
    } else {
      localStorage.removeItem("pulsebridge_refresh_token");
    }
  },
  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("pulsebridge_access_token");
    localStorage.removeItem("pulsebridge_refresh_token");
    localStorage.removeItem("pulsebridge_user");
  },
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enables cookie handling for session/refresh tokens
  timeout: 15000,
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Token Rotation Handler
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = originalRequest.url || "";

    // Ignore 401s from login or refresh endpoints to prevent infinite loops
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/register");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another refresh is in progress; queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = tokenStorage.getRefreshToken();

        // Call POST /auth/refresh with optional body and cookies
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken: storedRefreshToken || undefined,
          },
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          response.data?.data?.accessToken || response.data?.accessToken;
        const newRefreshToken =
          response.data?.data?.refreshToken || response.data?.refreshToken;

        if (newAccessToken) {
          tokenStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken);
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token returned from refresh endpoint");
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenStorage.clearAll();

        // Optional: redirect to login if running in browser
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (
            !currentPath.startsWith("/login") &&
            !currentPath.startsWith("/register") &&
            currentPath !== "/"
          ) {
            window.location.href = `/login?redirect=${encodeURIComponent(
              currentPath
            )}`;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
