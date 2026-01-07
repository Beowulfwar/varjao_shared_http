import { AxiosInstance, AxiosError } from "axios";
export interface ITokenManager {
    getAuthHeaders(): Record<string, string>;
    getToken(): string | null;
    getRefreshToken?(): string | null;
}
export interface ApiClientConfig {
    baseUrl: string;
    defaultBaseUrl?: string;
    apiPath?: string;
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
export declare function createApiClient(config: ApiClientConfig): AxiosInstance;
