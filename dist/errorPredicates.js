/** Predicados puros para tratamento de erros HTTP genéricos. */
const textFrom = (data) => {
    if (typeof data === 'string')
        return data;
    if (data && typeof data === 'object') {
        const maybeDetail = data.detail;
        if (typeof maybeDetail === 'string')
            return maybeDetail;
        const maybeError = data.error;
        if (typeof maybeError === 'string')
            return maybeError;
    }
    return '';
};
const codeFrom = (data, depth = 0) => {
    if (!data || typeof data !== 'object' || depth > 4)
        return '';
    const payload = data;
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
export function shouldLogout(error) {
    const status = error.response?.status;
    if (status === 401)
        return true;
    if (status !== 403)
        return false;
    const detail = textFrom(error.response?.data).toLowerCase();
    const code = codeFrom(error.response?.data).toLowerCase();
    if (!detail && !code)
        return false;
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
export function shouldSuppressNotFound(error) {
    const status = error.response?.status;
    if (status !== 404)
        return false;
    const suppress = error.config?.suppressNotFound;
    return Boolean(suppress);
}
export function isEmpresaMismatch(error) {
    const status = error.response?.status;
    if (status !== 403 && status !== 401)
        return false;
    const detail = textFrom(error.response?.data).toLowerCase();
    const hasEmpresa = detail.includes('empresa');
    if (!hasEmpresa)
        return false;
    const tokenIssue = detail.includes('token');
    const notFound = detail.includes('nao encontrad') || detail.includes('não encontrad');
    return tokenIssue || notFound;
}
export default {
    shouldLogout,
    shouldSuppressNotFound,
    isEmpresaMismatch,
};
