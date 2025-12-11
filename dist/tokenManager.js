import { isExpired } from "./authState.js";
const DEFAULT_STORAGE_KEY = "varjao_auth_data";
export class TokenManager {
    constructor(storage, storageKey = DEFAULT_STORAGE_KEY) {
        this.tokens = { usuarioToken: null };
        this.userData = null;
        this.activeEmpresaId = null;
        this.storage = storage;
        this.storageKey = storageKey;
    }
    /**
     * Inicializa o gerenciador restaurando dados do storage.
     * Deve ser chamado na inicialização da app.
     */
    async initialize() {
        try {
            const raw = await this.storage.getItem(this.storageKey);
            if (raw) {
                const data = JSON.parse(raw);
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
        }
        catch {
            // Falha silenciosa ao ler storage inválido ou vazio
            this.clearLocalState();
        }
    }
    getAuthHeaders() {
        const headers = {};
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
    getToken() {
        if (isExpired(this.tokens.usuarioExpiresAt)) {
            return null;
        }
        return this.tokens.usuarioToken;
    }
    getRefreshToken() {
        if (isExpired(this.tokens.usuarioRefreshExpiresAt)) {
            return null;
        }
        return this.tokens.usuarioRefreshToken ?? null;
    }
    getEmpresaToken() {
        if (isExpired(this.tokens.empresaExpiresAt)) {
            return null;
        }
        return this.tokens.empresaToken ?? null;
    }
    getEmpresaRefreshToken() {
        if (isExpired(this.tokens.empresaRefreshExpiresAt)) {
            return null;
        }
        return this.tokens.empresaRefreshToken ?? null;
    }
    getEmpresaId() {
        return this.activeEmpresaId;
    }
    getUserData() {
        return this.userData;
    }
    isAuthenticated() {
        return !!this.getToken();
    }
    // --- Actions ---
    async setAuthData(tokens, userData) {
        this.tokens = { ...tokens };
        if (userData) {
            this.userData = userData;
            this.activeEmpresaId = userData.empresa_id ?? null;
        }
        await this.persist();
    }
    async updateTokens(patch) {
        this.tokens = { ...this.tokens, ...patch };
        await this.persist();
    }
    async setEmpresaId(empresaId) {
        this.activeEmpresaId = empresaId;
        if (this.userData) {
            this.userData = { ...this.userData, empresa_id: empresaId };
        }
        await this.persist();
    }
    async clearAuth() {
        this.clearLocalState();
        await this.storage.removeItem(this.storageKey);
    }
    clearLocalState() {
        this.tokens = { usuarioToken: null };
        this.userData = null;
        this.activeEmpresaId = null;
    }
    async persist() {
        const data = {
            ...this.tokens,
            userData: this.userData,
            activeEmpresaId: this.activeEmpresaId,
        };
        await this.storage.setItem(this.storageKey, JSON.stringify(data));
    }
}
