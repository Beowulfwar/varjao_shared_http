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

export function shouldLogout(error: HttpLikeError): boolean {
  const status = error.response?.status;
  if (status === 401 || status === 403) return true;
  const detail = textFrom(error.response?.data).toLowerCase();
  if (!detail) return false;
  return detail.includes('sessão expirada') || detail.includes('token inválido') || detail.includes('não autenticado');
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
