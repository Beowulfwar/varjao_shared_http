/**
 * Helpers para construir headers de contexto de dispositivo sem depender de DOM/React.
 */

export type DeviceInfo = {
  id?: string | null;
  hash?: string | null;
  nome?: string | null;
  memoria?: string | null;
  fuso?: string | null;
  idioma?: string | null;
  userAgent?: string | null;
};

const safeNavigator = (): Partial<Navigator> | null => {
  try {
    if (typeof navigator !== 'undefined') return navigator;
  } catch (_) {
    /* ignore */
  }
  return null;
};

export function buildDeviceInfo(partial?: DeviceInfo): DeviceInfo {
  const nav = safeNavigator();
  return {
    id: partial?.id ?? null,
    hash: partial?.hash ?? null,
    nome: partial?.nome ?? null,
    memoria: partial?.memoria ?? (nav && 'deviceMemory' in nav ? String((nav as any).deviceMemory) : null),
    fuso: partial?.fuso ?? (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
      : null),
    idioma: partial?.idioma ?? (nav?.language ?? (Array.isArray(nav?.languages) ? nav?.languages[0] : null) ?? null),
    userAgent: partial?.userAgent ?? (nav?.userAgent ?? null),
  };
}

export function buildDeviceHeaders(info?: DeviceInfo): Record<string, string> {
  const device = buildDeviceInfo(info);
  const headers: Record<string, string> = {};
  if (device.id) headers['X-Id-Dispositivo'] = device.id;
  if (device.hash) headers['X-Hash-Agente'] = device.hash;
  if (device.nome) headers['X-Nome-Dispositivo'] = device.nome;
  if (device.userAgent) headers['X-Agente-Usuario'] = device.userAgent;
  if (device.memoria) headers['X-Memoria-Dispositivo'] = device.memoria;
  if (device.fuso) headers['X-Fuso-Horario'] = device.fuso;
  if (device.idioma) headers['X-Idioma-Padrao'] = device.idioma;
  return headers;
}

export default {
  buildDeviceInfo,
  buildDeviceHeaders,
};
