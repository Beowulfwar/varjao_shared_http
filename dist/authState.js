/**
 * Contratos para estados de autenticação. Implementações ficam em cada app.
 */
export function isExpired(expiresAt, leewaySeconds = 0) {
    if (!expiresAt)
        return false;
    const ts = typeof expiresAt === 'number'
        ? expiresAt * 1000
        : expiresAt instanceof Date
            ? expiresAt.getTime()
            : Date.parse(expiresAt);
    if (Number.isNaN(ts))
        return false;
    return ts <= Date.now() + leewaySeconds * 1000;
}
export function coerceExpiresAt(value) {
    if (value === null || value === undefined)
        return null;
    if (typeof value === 'number')
        return Number.isFinite(value) ? value * 1000 : null;
    if (value instanceof Date)
        return value.getTime();
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
}
export default {
    isExpired,
    coerceExpiresAt,
};
