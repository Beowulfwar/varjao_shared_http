import { describe, it, expect } from 'vitest';
import { createRefreshCoordinator } from '../src/refreshCoordinator.js';

describe('refreshCoordinator', () => {
  it('dedupe refresh simultâneo', async () => {
    let calls = 0;
    const coordinator = createRefreshCoordinator({
      usuario: async () => {
        calls += 1;
        await new Promise((r) => setTimeout(r, 10));
        return 'ok';
      },
    });

    const results = await Promise.all([
      coordinator.refreshUsuario(),
      coordinator.refreshUsuario(),
      coordinator.refreshUsuario(),
    ]);

    expect(results).toEqual(['ok', 'ok', 'ok']);
    expect(calls).toBe(1);
  });

  it('permite executar refresh custom via run', async () => {
    const coordinator = createRefreshCoordinator({});
    const result = await coordinator.run('custom', async () => 'done');
    expect(result).toBe('done');
  });
});
