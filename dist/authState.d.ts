/**
 * Contratos para estados de autenticação. Implementações ficam em cada app.
 */
export type TokenSnapshot = {
    token: string | null;
    expiresAt?: string | number | Date | null;
    refreshToken?: string | null;
    refreshExpiresAt?: string | number | Date | null;
};
export interface AuthState {
    /** Token principal (usuário web ou mobile). */
    getAccessToken(): TokenSnapshot;
    /** Token da empresa (quando aplicável). */
    getEmpresaToken?(): TokenSnapshot;
    /** Token multiempresa (quando aplicável). */
    getMultiEmpresaToken?(): TokenSnapshot;
    /** Identificador ativo da empresa. */
    getEmpresaId?(): string | null;
    /** Identificador do usuário (quando disponível). */
    getUsuarioId?(): string | null;
}
export declare function isExpired(expiresAt: string | number | Date | null | undefined, leewaySeconds?: number): boolean;
export declare function coerceExpiresAt(value: string | number | Date | null | undefined): number | null;
declare const _default: {
    isExpired: typeof isExpired;
    coerceExpiresAt: typeof coerceExpiresAt;
};
export default _default;
