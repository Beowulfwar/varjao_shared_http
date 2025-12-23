import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosHeaders,
    AxiosError,
    AxiosResponse
} from "axios";
import { TokenManager } from "./tokenManager.js";
import { buildApiBaseUrl } from "./baseUrl.js";

export interface ITokenManager {
    getAuthHeaders(): Record<string, string>;
    getToken(): string | null;
    getRefreshToken?(): string | null;
}

export interface ApiClientConfig {
    baseUrl: string;
    defaultBaseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
    tokenManager: ITokenManager;
    onForceLogout?: () => void;
    onUnauthorized?: (error: AxiosError) => Promise<void>;
    /**
     * Optional handler to refresh token on 401.
     * Should return the new access token if successful, or null/throw if failed.
     */
    onTokenRefresh?: (error: AxiosError) => Promise<string | null>;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
    const {
        baseUrl,
        defaultBaseUrl = "http://localhost:8000",
        timeout = 15000,
        headers = {},
        tokenManager,
        onForceLogout,
        onUnauthorized,
        onTokenRefresh
    } = config;

    const resolvedBaseUrl = buildApiBaseUrl(baseUrl, { defaultBase: defaultBaseUrl });

    const api = axios.create({
        baseURL: resolvedBaseUrl,
        timeout,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        withCredentials: true
    });

    // Request Interceptor: Inject Auth Headers
    api.interceptors.request.use(
        (reqConfig: InternalAxiosRequestConfig) => {
            const authHeaders = tokenManager.getAuthHeaders();
            const existingHeaders = AxiosHeaders.from(reqConfig.headers || {});

            Object.entries(authHeaders).forEach(([key, value]) => {
                if (!existingHeaders.has(key)) {
                    existingHeaders.set(key, value);
                }
            });

            reqConfig.headers = existingHeaders;
            return reqConfig;
        },
        (error: unknown) => Promise.reject(error)
    );

    // Response Interceptor: Handle Global Errors
    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const status = error.response?.status;
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Force Logout conditions
            if (status === 400) {
                const data = error.response?.data as any;
                const msg = (data?.error || "").toString().toLowerCase();
                if ((msg.includes("empresa") && msg.includes("encontrad")) || msg.includes("id da empresa")) {
                    if (onForceLogout) {
                        onForceLogout();
                    }
                    const e = new Error("Sessão inválida (empresa). Logout forçado.");
                    (e as any).shouldForceLogout = true;
                    return Promise.reject(e);
                }
            }

            // 401 Handling (Refresh or Unauthorized)
            if (status === 401) {
                // Prevent infinite loops
                if (originalRequest && !originalRequest._retry && onTokenRefresh) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await onTokenRefresh(error);
                        if (newToken) {
                            // Update header and retry
                            if (originalRequest.headers) {
                                originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
                            }
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        // Refresh failed, fall through to onUnauthorized
                    }
                }

                if (onUnauthorized) {
                    await onUnauthorized(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
}
