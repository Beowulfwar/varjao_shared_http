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

const DEFAULT_BASE = 'http://localhost:8000';
const DEFAULT_API_PATH = '/api/v1';

/** Normaliza host/base removendo sufixos duplicados de API. */
export function normalizeBaseUrl(input?: string | null, options: NormalizeBaseUrlOptions = {}): string {
  const baseFallback = options.defaultBase ?? DEFAULT_BASE;
  const trimmed = (input ?? '').trim();
  if (!trimmed) return baseFallback;

  // Remover trailing slashes múltiplos
  let cleaned = trimmed.replace(/\/+$/, '');
  const lower = cleaned.toLowerCase();

  const apiV1 = '/api/v1';
  const api = '/api';

  if (lower.endsWith(apiV1)) {
    cleaned = cleaned.slice(0, -apiV1.length);
  } else if (lower.endsWith(api)) {
    cleaned = cleaned.slice(0, -api.length);
  }

  return cleaned || baseFallback;
}

/**
 * Garante uma URL final de API (inclui apiPath apenas uma vez).
 * Útil para instanciar clientes HTTP.
 */
export function buildApiBaseUrl(input?: string | null, options: NormalizeBaseUrlOptions = {}): string {
  const apiPathRaw = options.apiPath ?? DEFAULT_API_PATH;
  const apiPath = apiPathRaw.startsWith('/') ? apiPathRaw : `/${apiPathRaw}`;
  const base = normalizeBaseUrl(input, options);
  const merged = `${base}${apiPath}`.replace(/\/+$/, '');
  return merged;
}

export function ensureTrailingSlash(value: string): string {
  if (!value) return '/';
  return value.endsWith('/') ? value : `${value}/`;
}

export function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export default {
  normalizeBaseUrl,
  buildApiBaseUrl,
  ensureTrailingSlash,
  withoutTrailingSlash,
};
