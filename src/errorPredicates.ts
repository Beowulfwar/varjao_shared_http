/** Predicados puros para tratamento de erros HTTP genéricos. */

export type HttpLikeError = {
  response?: { status?: number; data?: unknown };
  message?: string;
  config?: Record<string, unknown>;
};

const textFrom = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const maybeDetail = (data as Record<string, unknown>).detail;
    if (typeof maybeDetail === 'string') return maybeDetail;
    const maybeError = (data as Record<string, unknown>).error;
    if (typeof maybeError === 'string') return maybeError;
  }
  return '';
};

const codeFrom = (data: unknown, depth = 0): string => {
  if (!data || typeof data !== 'object' || depth > 4) return '';
  const payload = data as Record<string, unknown>;
  const candidates = [
    payload.code,
    payload.codigo,
    payload.error_code,
    payload.errorCode,
    payload.status_code,
    payload.statusCode,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
  }
  const nested = payload.detail ?? payload.error;
  if (nested && nested !== data) {
    return codeFrom(nested, depth + 1);
  }
  return '';
};

export function shouldLogout(error: HttpLikeError): boolean {
  const status = error.response?.status;
  if (status === 401) return true;
  if (status !== 403) return false;

  const detail = textFrom(error.response?.data).toLowerCase();
  const code = codeFrom(error.response?.data).toLowerCase();
  if (!detail && !code) return false;

  const detailSignals = [
    'sessão expirada',
    'sessao expirada',
    'token inválido',
    'token invalido',
    'token expirado',
    'não autenticado',
    'nao autenticado',
  ];
  if (detailSignals.some((signal) => detail.includes(signal))) {
    return true;
  }

  const codeSignals = ['token', 'session', 'sessao', 'unauth'];
  return codeSignals.some((signal) => code.includes(signal));
}

export function shouldSuppressNotFound(error: HttpLikeError): boolean {
  const status = error.response?.status;
  if (status !== 404) return false;
  const suppress = error.config?.suppressNotFound;
  return Boolean(suppress);
}

export function isEmpresaMismatch(error: HttpLikeError): boolean {
  const status = error.response?.status;
  if (status !== 403 && status !== 401) return false;
  const detail = textFrom(error.response?.data).toLowerCase();
  const hasEmpresa = detail.includes('empresa');
  if (!hasEmpresa) return false;
  const tokenIssue = detail.includes('token');
  const notFound = detail.includes('nao encontrad') || detail.includes('não encontrad');
  return tokenIssue || notFound;
}

export default {
  shouldLogout,
  shouldSuppressNotFound,
  isEmpresaMismatch,
};
