/**
 * Helpers puros para mesclar e aplicar headers de forma idempotente.
 * Sem dependências de runtime (Axios/Fetch).
 */
export type HeaderBag = Record<string, string>;
/**
 * Retorna um novo objeto de headers aplicando a chave apenas se ela ainda não existir (case-insensitive).
 */
export declare function ensureHeader(headers: HeaderBag, key: string, value: string | null | undefined): HeaderBag;
/** Merge leve, respeitando chaves existentes no destino. */
export declare function mergeHeaders(base?: HeaderBag, extra?: HeaderBag): HeaderBag;
export type StandardHeaderOptions = {
    accessToken?: string | null;
    empresaId?: string | null;
    deviceId?: string | null;
    deviceHash?: string | null;
    usuarioId?: string | null;
};
/**
 * Aplica cabeçalhos padrão (Authorization, empresa e device) sem sobrescrever valores existentes.
 */
export declare function applyStandardHeaders(headers?: HeaderBag, options?: StandardHeaderOptions): HeaderBag;
export declare function normalizeBearer(token: string): string;
declare const _default: {
    ensureHeader: typeof ensureHeader;
    mergeHeaders: typeof mergeHeaders;
    applyStandardHeaders: typeof applyStandardHeaders;
    normalizeBearer: typeof normalizeBearer;
};
export default _default;
