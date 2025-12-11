export interface AuthTokens {
    usuarioToken: string | null;
    usuarioExpiresAt?: string | number | Date | null;
    usuarioRefreshToken?: string | null;
    usuarioRefreshExpiresAt?: string | number | Date | null;
    empresaToken?: string | null;
    empresaExpiresAt?: string | number | Date | null;
    empresaRefreshToken?: string | null;
    empresaRefreshExpiresAt?: string | number | Date | null;
}
export interface SessionData {
    usuario_id: string;
    email?: string | null;
    usuario_nome?: string | null;
    perfil?: string | null;
    empresa_id?: string | null;
    [key: string]: unknown;
}
export interface StoredAuthData extends AuthTokens {
    userData?: SessionData | null;
    activeEmpresaId?: string | null;
}
export interface TokenStorageProvider {
    getItem(key: string): string | null | Promise<string | null>;
    setItem(key: string, value: string): void | Promise<void>;
    removeItem(key: string): void | Promise<void>;
}
