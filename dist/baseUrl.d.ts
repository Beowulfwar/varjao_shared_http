/**
 * Funções puras para normalizar URLs de API.
 * Evita duplicações de "/api"/"/api/v1" e trailing slashes inconsistentes.
 */
export type NormalizeBaseUrlOptions = {
    /** Valor utilizado quando o input for vazio ou inválido. */
    defaultBase?: string;
    /** Caminho da API a ser anexado ao base (ex.: "/api/v1"). */
    apiPath?: string;
};
/** Normaliza host/base removendo sufixos duplicados de API. */
export declare function normalizeBaseUrl(input?: string | null, options?: NormalizeBaseUrlOptions): string;
/**
 * Garante uma URL final de API (inclui apiPath apenas uma vez).
 * Útil para instanciar clientes HTTP.
 */
export declare function buildApiBaseUrl(input?: string | null, options?: NormalizeBaseUrlOptions): string;
export declare function ensureTrailingSlash(value: string): string;
export declare function withoutTrailingSlash(value: string): string;
declare const _default: {
    normalizeBaseUrl: typeof normalizeBaseUrl;
    buildApiBaseUrl: typeof buildApiBaseUrl;
    ensureTrailingSlash: typeof ensureTrailingSlash;
    withoutTrailingSlash: typeof withoutTrailingSlash;
};
export default _default;
