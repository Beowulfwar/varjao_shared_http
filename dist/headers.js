/**
 * Helpers puros para mesclar e aplicar headers de forma idempotente.
 * Sem dependências de runtime (Axios/Fetch).
 */
const normalizeKey = (key) => key.trim().toLowerCase();
const hasKey = (headers, key) => {
    const target = normalizeKey(key);
    return Object.keys(headers).some((k) => normalizeKey(k) === target);
};
/**
 * Retorna um novo objeto de headers aplicando a chave apenas se ela ainda não existir (case-insensitive).
 */
export function ensureHeader(headers, key, value) {
    if (value === undefined || value === null || String(value).trim() === '')
        return { ...headers };
    if (hasKey(headers, key))
        return { ...headers };
    return { ...headers, [key]: String(value) };
}
/** Merge leve, respeitando chaves existentes no destino. */
export function mergeHeaders(base = {}, extra = {}) {
    let result = { ...base };
    Object.entries(extra).forEach(([key, value]) => {
        result = ensureHeader(result, key, value);
    });
    return result;
}
/**
 * Aplica cabeçalhos padrão (Authorization, empresa e device) sem sobrescrever valores existentes.
 */
export function applyStandardHeaders(headers = {}, options = {}) {
    let result = { ...headers };
    if (options.accessToken) {
        result = ensureHeader(result, 'Authorization', normalizeBearer(options.accessToken));
    }
    if (options.empresaId) {
        result = ensureHeader(result, 'Empresa-ID', options.empresaId);
        result = ensureHeader(result, 'X-Empresa-ID', options.empresaId);
    }
    if (options.deviceId) {
        result = ensureHeader(result, 'X-Id-Dispositivo', options.deviceId);
    }
    if (options.deviceHash) {
        result = ensureHeader(result, 'X-Hash-Agente', options.deviceHash);
    }
    if (options.usuarioId) {
        result = ensureHeader(result, 'X-Usuario-Id', options.usuarioId);
    }
    return result;
}
export function normalizeBearer(token) {
    const trimmed = token.trim();
    return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}
export default {
    ensureHeader,
    mergeHeaders,
    applyStandardHeaders,
    normalizeBearer,
};
