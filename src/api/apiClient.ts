import axios, { AxiosError, type InternalAxiosRequestConfig, type Method } from 'axios';
import type { ApiErrorResponse } from '../types/axios';

/**
 * Axios client for the Kalā Studio API.
 * Successful responses have the shape { status, message, data }; failed ones are ApiErrorResponse.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  /** HTTP status code, or 0 when the server could not be reached */
  status: number;
  /**
   * Validation messages keyed by request field path, e.g. { title: '…', 'images[0].alt': '…' }.
   * Empty unless the server rejected the request body.
   */
  fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Extra per-request options understood by the interceptors below
declare module 'axios' {
  interface AxiosRequestConfig {
    /** Don't attach the access token or refresh it on 401 (login, refresh-token, logout) */
    skipAuth?: boolean;
    /** Set once the request has been replayed with a refreshed token */
    _retry?: boolean;
  }
}

// ─── Auth handlers ────────────────────────────────────────────────────────────
// The store registers these, so this module doesn't import the store (which imports this module).
// The store also makes sure only one refresh runs at a time: the backend ends the session if a
// refresh token is used twice, so concurrent 401s all wait on the same refresh.
interface AuthHandlers {
  getAccessToken: () => string | null;
  /** True when the current access token has expired or is about to */
  isAccessTokenExpiring: () => boolean;
  /** Resolves to a new access token, or null when the session can't be refreshed */
  refreshAccessToken: () => Promise<string | null>;
}

let authHandlers: AuthHandlers | null = null;

/** Called once by the store */
export function registerAuthHandlers(handlers: AuthHandlers) {
  authHandlers = handlers;
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' }
  // No default Content-Type: axios sends objects as JSON, and lets the browser set the
  // multipart boundary for FormData.
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attach the access token to every outgoing request, refreshing it first if it's about to expire.
// Refreshing up front matters for uploads: the server rejects a stale token before reading the
// body and closes the connection, so the client sees a dropped connection (or, through the Vite
// proxy, an empty 500) instead of a 401, and the retry below never happens.
axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.skipAuth || !authHandlers) return config;
  let token = authHandlers.getAccessToken();
  if (token && authHandlers.isAccessTokenExpiring()) {
    // If the refresh fails, send the old token: the server's 401 then ends the session as usual
    token = (await authHandlers.refreshAccessToken()) ?? token;
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response) {
      const { status, data } = error.response;
      // data is a string, not an object, when e.g. a proxy returns an HTML error page
      const payload = typeof data === 'object' && data !== null ? data : null;
      const fieldErrors = Object.fromEntries(
        (Array.isArray(payload?.fieldErrors) ? payload.fieldErrors : []).map((e) => [e.field, e.message])
      );
      return new ApiError(
        status,
        payload?.error ?? payload?.message ?? `Request failed (${status}).`,
        fieldErrors
      );
    }
    if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
      return new ApiError(0, 'The server took too long to respond. Please try again.');
    }
  }
  return new ApiError(0, 'Could not reach the server. Check your connection and try again.');
}

// ─── Response interceptor ─────────────────────────────────────────────────────
// On 401, get a new access token (the access token lasts 15 minutes) and replay the request
// once. Every other failure becomes an ApiError.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Let callers that abort a request see the cancellation as-is
    if (axios.isCancel(error)) throw error;

    const config = axios.isAxiosError(error) ? error.config : undefined;
    const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;

    if (isUnauthorized && config && !config.skipAuth && !config._retry && authHandlers) {
      const newToken = await authHandlers.refreshAccessToken();
      if (newToken) {
        config._retry = true;
        config.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(config);
      }
      // Refresh failed: the store has already signed the user out
    }
    throw toApiError(error);
  }
);

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
// Each helper resolves to the envelope's `data` and rejects with an ApiError.
type RequestParams = {
  path: string;
  /** Sent as JSON, or as multipart when it is FormData (file uploads) */
  reqBody?: unknown;
  params?: Record<string, unknown>;
  header?: Record<string, string>;
  skipAuth?: boolean;
  /** Milliseconds; overrides the 10 s default, e.g. for file uploads */
  timeout?: number;
};

async function request<T>(
  method: Method,
  { path, reqBody, params, header, skipAuth, timeout }: RequestParams
): Promise<T> {
  const response = await axiosClient.request<ApiEnvelope<T>>({
    method,
    url: path,
    data: reqBody,
    params,
    headers: header,
    skipAuth,
    timeout
  });
  return response.data?.data as T;
}

export const get = <T>(params: Omit<RequestParams, 'reqBody'>) => request<T>('GET', params);
export const post = <T>(params: RequestParams) => request<T>('POST', params);
export const put = <T>(params: RequestParams) => request<T>('PUT', params);
export const patch = <T>(params: RequestParams) => request<T>('PATCH', params);
export const deleteRequest = <T>(params: Omit<RequestParams, 'reqBody'>) =>
  request<T>('DELETE', params);

export default axiosClient;
