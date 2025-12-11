import { AxiosInstance, AxiosError } from "axios";
import { TokenManager } from "./tokenManager.js";
export interface ApiClientConfig {
    baseUrl: string;
    defaultBaseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
    tokenManager: TokenManager;
    onForceLogout?: () => void;
    onUnauthorized?: (error: AxiosError) => Promise<void>;
    /**
     * Optional handler to refresh token on 401.
     * Should return the new access token if successful, or null/throw if failed.
     */
    onTokenRefresh?: (error: AxiosError) => Promise<string | null>;
}
export declare function createApiClient(config: ApiClientConfig): AxiosInstance;
