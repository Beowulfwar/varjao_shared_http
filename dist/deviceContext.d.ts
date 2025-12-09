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
export declare function buildDeviceInfo(partial?: DeviceInfo): DeviceInfo;
export declare function buildDeviceHeaders(info?: DeviceInfo): Record<string, string>;
declare const _default: {
    buildDeviceInfo: typeof buildDeviceInfo;
    buildDeviceHeaders: typeof buildDeviceHeaders;
};
export default _default;
