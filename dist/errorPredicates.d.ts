/** Predicados puros para tratamento de erros HTTP genéricos. */
export type HttpLikeError = {
    response?: {
        status?: number;
        data?: unknown;
    };
    message?: string;
    config?: Record<string, unknown>;
};
export declare function shouldLogout(error: HttpLikeError): boolean;
export declare function shouldSuppressNotFound(error: HttpLikeError): boolean;
export declare function isEmpresaMismatch(error: HttpLikeError): boolean;
declare const _default: {
    shouldLogout: typeof shouldLogout;
    shouldSuppressNotFound: typeof shouldSuppressNotFound;
    isEmpresaMismatch: typeof isEmpresaMismatch;
};
export default _default;
