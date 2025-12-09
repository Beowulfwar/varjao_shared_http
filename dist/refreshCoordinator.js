/**
 * Coordenador de refresh com dedupe: múltiplas chamadas simultâneas compartilham a mesma promessa.
 */
class InflightCoordinator {
    constructor(callbacks) {
        this.inflight = new Map();
        this.callbacks = callbacks;
    }
    async run(kind, fn) {
        const existing = this.inflight.get(kind);
        if (existing)
            return existing;
        const promise = fn().finally(() => {
            this.inflight.delete(kind);
        });
        this.inflight.set(kind, promise);
        return promise;
    }
    refreshUsuario() {
        const cb = this.callbacks['usuario'];
        if (!cb)
            return Promise.reject(new Error('refreshUsuario não configurado'));
        return this.run('usuario', cb);
    }
    refreshEmpresa() {
        const cb = this.callbacks['empresa'];
        if (!cb)
            return Promise.reject(new Error('refreshEmpresa não configurado'));
        return this.run('empresa', cb);
    }
    refreshMobile() {
        const cb = this.callbacks['mobile'];
        if (!cb)
            return Promise.reject(new Error('refreshMobile não configurado'));
        return this.run('mobile', cb);
    }
}
export function createRefreshCoordinator(callbacks = {}) {
    return new InflightCoordinator(callbacks);
}
export default {
    createRefreshCoordinator,
};
