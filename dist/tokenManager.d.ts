import { AuthTokens, SessionData, TokenStorageProvider } from "./types/auth.types.js";
export declare class TokenManager {
    private tokens;
    private userData;
    private activeEmpresaId;
    private storage;
    private storageKey;
    constructor(storage: TokenStorageProvider, storageKey?: string);
    /**
     * Inicializa o gerenciador restaurando dados do storage.
     * Deve ser chamado na inicialização da app.
     */
    initialize(): Promise<void>;
    getAuthHeaders(): Record<string, string>;
    getToken(): string | null;
    getRefreshToken(): string | null;
    getEmpresaToken(): string | null;
    getEmpresaRefreshToken(): string | null;
    getEmpresaId(): string | null;
    getUserData(): SessionData | null;
    isAuthenticated(): boolean;
    setAuthData(tokens: AuthTokens, userData?: SessionData): Promise<void>;
    updateTokens(patch: Partial<AuthTokens>): Promise<void>;
    setEmpresaId(empresaId: string | null): Promise<void>;
    clearAuth(): Promise<void>;
    private clearLocalState;
    private persist;
}
