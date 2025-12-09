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

export function isExpired(expiresAt: string | number | Date | null | undefined, leewaySeconds = 0): boolean {
  if (!expiresAt) return false;
  const ts = typeof expiresAt === 'number'
    ? expiresAt * 1000
    : expiresAt instanceof Date
      ? expiresAt.getTime()
      : Date.parse(expiresAt);
  if (Number.isNaN(ts)) return false;
  return ts <= Date.now() + leewaySeconds * 1000;
}

export function coerceExpiresAt(value: string | number | Date | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value * 1000 : null;
  if (value instanceof Date) return value.getTime();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export default {
  isExpired,
  coerceExpiresAt,
};
