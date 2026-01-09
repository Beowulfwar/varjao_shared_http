import { describe, it, expect, vi } from 'vitest';
import { createRefreshCoordinator } from '../src/refreshCoordinator.js';

describe('refreshCoordinator', () => {
  it('dedupe refresh simultâneo', async () => {
    vi.useFakeTimers();
    try {
      let calls = 0;
      const coordinator = createRefreshCoordinator({
        usuario: async () => {
          calls += 1;
          await new Promise((r) => setTimeout(r, 10));
          return 'ok';
        },
      });

      const promises = [
        coordinator.refreshUsuario(),
        coordinator.refreshUsuario(),
        coordinator.refreshUsuario(),
      ];
      await vi.runAllTimersAsync();
      const results = await Promise.all(promises);

      expect(results).toEqual(['ok', 'ok', 'ok']);
      expect(calls).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('permite executar refresh custom via run', async () => {
    const coordinator = createRefreshCoordinator({});
    const result = await coordinator.run('custom', async () => 'done');
    expect(result).toBe('done');
  });
});
