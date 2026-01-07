import axios, { AxiosHeaders } from "axios";
import { buildApiBaseUrl } from "./baseUrl.js";
export function createApiClient(config) {
    const { baseUrl, defaultBaseUrl = "http://localhost:8000", apiPath, timeout = 15000, headers = {}, tokenManager, onForceLogout, onUnauthorized, onTokenRefresh } = config;
    const resolvedBaseUrl = buildApiBaseUrl(baseUrl, { defaultBase: defaultBaseUrl, apiPath });
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
    api.interceptors.request.use((reqConfig) => {
        const authHeaders = tokenManager.getAuthHeaders();
        const existingHeaders = AxiosHeaders.from(reqConfig.headers || {});
        Object.entries(authHeaders).forEach(([key, value]) => {
            if (!existingHeaders.has(key)) {
                existingHeaders.set(key, value);
            }
        });
        reqConfig.headers = existingHeaders;
        return reqConfig;
    }, (error) => Promise.reject(error));
    // Response Interceptor: Handle Global Errors
    api.interceptors.response.use((response) => response, async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;
        // Force Logout conditions
        if (status === 400) {
            const data = error.response?.data;
            const msg = (data?.error || "").toString().toLowerCase();
            if ((msg.includes("empresa") && msg.includes("encontrad")) || msg.includes("id da empresa")) {
                if (onForceLogout) {
                    onForceLogout();
                }
                const e = new Error("Sessão inválida (empresa). Logout forçado.");
                e.shouldForceLogout = true;
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
                }
                catch (refreshError) {
                    // Refresh failed, fall through to onUnauthorized
                }
            }
            if (onUnauthorized) {
                await onUnauthorized(error);
            }
        }
        return Promise.reject(error);
    });
    return api;
}
