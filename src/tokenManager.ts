import { AuthTokens, SessionData, StoredAuthData, TokenStorageProvider } from "./types/auth.types.js";
import { isExpired } from "./authState.js";

const DEFAULT_STORAGE_KEY = "varjao_auth_data";

export class TokenManager {
    private tokens: AuthTokens = { usuarioToken: null };
    private userData: SessionData | null = null;
    private activeEmpresaId: string | null = null;

    private storage: TokenStorageProvider;
    private storageKey: string;

    constructor(storage: TokenStorageProvider, storageKey = DEFAULT_STORAGE_KEY) {
        this.storage = storage;
        this.storageKey = storageKey;
    }

    /**
     * Inicializa o gerenciador restaurando dados do storage.
     * Deve ser chamado na inicialização da app.
     */
    async initialize(): Promise<void> {
        try {
            const raw = await this.storage.getItem(this.storageKey);
            if (raw) {
                const data = JSON.parse(raw) as StoredAuthData;
                this.tokens = {
                    usuarioToken: data.usuarioToken ?? null,
                    usuarioExpiresAt: data.usuarioExpiresAt,
                    usuarioRefreshToken: data.usuarioRefreshToken,
                    usuarioRefreshExpiresAt: data.usuarioRefreshExpiresAt,
                    empresaToken: data.empresaToken,
                    empresaExpiresAt: data.empresaExpiresAt,
                    empresaRefreshToken: data.empresaRefreshToken,
                    empresaRefreshExpiresAt: data.empresaRefreshExpiresAt,
                };
                this.userData = data.userData ?? null;
                this.activeEmpresaId = data.activeEmpresaId ?? data.userData?.empresa_id ?? null;
            }
        } catch {
            // Falha silenciosa ao ler storage inválido ou vazio
            this.clearLocalState();
        }
    }

    getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {};
        const token = this.getToken();

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (this.activeEmpresaId) {
            headers["Empresa-ID"] = this.activeEmpresaId;
            headers["X-Empresa-ID"] = this.activeEmpresaId;
        }

        return headers;
    }

    getToken(): string | null {
        if (isExpired(this.tokens.usuarioExpiresAt)) {
            return null;
        }
        return this.tokens.usuarioToken;
    }

    getRefreshToken(): string | null {
        if (isExpired(this.tokens.usuarioRefreshExpiresAt)) {
            return null;
        }
        return this.tokens.usuarioRefreshToken ?? null;
    }

    getEmpresaToken(): string | null {
        if (isExpired(this.tokens.empresaExpiresAt)) {
            return null;
        }
        return this.tokens.empresaToken ?? null;
    }

    getEmpresaRefreshToken(): string | null {
        if (isExpired(this.tokens.empresaRefreshExpiresAt)) {
            return null;
        }
        return this.tokens.empresaRefreshToken ?? null;
    }

    getEmpresaId(): string | null {
        return this.activeEmpresaId;
    }

    getUserData(): SessionData | null {
        return this.userData;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // --- Actions ---

    async setAuthData(tokens: AuthTokens, userData?: SessionData): Promise<void> {
        this.tokens = { ...tokens };
        if (userData) {
            this.userData = userData;
            this.activeEmpresaId = userData.empresa_id ?? null;
        }
        await this.persist();
    }

    async updateTokens(patch: Partial<AuthTokens>): Promise<void> {
        this.tokens = { ...this.tokens, ...patch };
        await this.persist();
    }

    async setEmpresaId(empresaId: string | null): Promise<void> {
        this.activeEmpresaId = empresaId;
        if (this.userData) {
            this.userData = { ...this.userData, empresa_id: empresaId };
        }
        await this.persist();
    }

    async clearAuth(): Promise<void> {
        this.clearLocalState();
        await this.storage.removeItem(this.storageKey);
    }

    private clearLocalState(): void {
        this.tokens = { usuarioToken: null };
        this.userData = null;
        this.activeEmpresaId = null;
    }

    private async persist(): Promise<void> {
        const data: StoredAuthData = {
            ...this.tokens,
            userData: this.userData,
            activeEmpresaId: this.activeEmpresaId,
        };
        await this.storage.setItem(this.storageKey, JSON.stringify(data));
    }
}
