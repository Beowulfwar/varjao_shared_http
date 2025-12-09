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

class InflightCoordinator implements RefreshCoordinator {
  private inflight = new Map<RefreshKind, Promise<unknown>>();
  private callbacks: RefreshCallbacks;

  constructor(callbacks: RefreshCallbacks) {
    this.callbacks = callbacks;
  }

  async run<T>(kind: RefreshKind, fn: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(kind) as Promise<T> | undefined;
    if (existing) return existing;

    const promise = fn().finally(() => {
      this.inflight.delete(kind);
    });
    this.inflight.set(kind, promise);
    return promise;
  }

  refreshUsuario(): Promise<unknown> {
    const cb = this.callbacks['usuario'];
    if (!cb) return Promise.reject(new Error('refreshUsuario não configurado'));
    return this.run('usuario', cb);
  }

  refreshEmpresa(): Promise<unknown> {
    const cb = this.callbacks['empresa'];
    if (!cb) return Promise.reject(new Error('refreshEmpresa não configurado'));
    return this.run('empresa', cb);
  }

  refreshMobile(): Promise<unknown> {
    const cb = this.callbacks['mobile'];
    if (!cb) return Promise.reject(new Error('refreshMobile não configurado'));
    return this.run('mobile', cb);
  }
}

export function createRefreshCoordinator(callbacks: RefreshCallbacks = {}): RefreshCoordinator {
  return new InflightCoordinator(callbacks);
}

export default {
  createRefreshCoordinator,
};
