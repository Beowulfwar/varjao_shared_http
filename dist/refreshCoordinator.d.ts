/**
 * Coordenador de refresh com dedupe: múltiplas chamadas simultâneas compartilham a mesma promessa.
 */
export type RefreshKind = 'usuario' | 'empresa' | 'mobile' | string;
export type RefreshCallbacks = Partial<Record<RefreshKind, () => Promise<unknown>>>;
export interface RefreshCoordinator {
    run<T>(kind: RefreshKind, fn: () => Promise<T>): Promise<T>;
    refreshUsuario(): Promise<unknown>;
    refreshEmpresa(): Promise<unknown>;
    refreshMobile(): Promise<unknown>;
}
export declare function createRefreshCoordinator(callbacks?: RefreshCallbacks): RefreshCoordinator;
declare const _default: {
    createRefreshCoordinator: typeof createRefreshCoordinator;
};
export default _default;
