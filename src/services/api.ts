import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse, RefreshResponse } from "@/types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-storage";

/** Normalized error thrown by every API call. `message` is user-facing Turkish. */
export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors: Record<string, string> | null;

  constructor(
    message: string,
    status: number,
    validationErrors: Record<string, string> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Deduplicates concurrent refresh attempts: many requests may hit 401 at once,
// but the (single-use, rotated) refresh token must be sent exactly once.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError("Oturum bulunamadı.", 401);
  }
  // Bare axios call so it does not re-enter this instance's interceptors.
  const { data } = await axios.post<RefreshResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    { refreshToken },
  );
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const isAuthCall = original?.url?.startsWith("/auth/") ?? false;

    // Expired access token: refresh once and replay the original request.
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthCall &&
      getRefreshToken()
    ) {
      original._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // Refresh token invalid/expired too — the session is over.
        clearTokens();
      }
    }

    const body = error.response?.data;
    return Promise.reject(
      new ApiError(
        body?.message ?? "Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.",
        error.response?.status ?? 0,
        body?.validationErrors ?? null,
      ),
    );
  },
);
