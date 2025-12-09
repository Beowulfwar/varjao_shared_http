import { describe, it, expect } from 'vitest';
import { ensureHeader, mergeHeaders, applyStandardHeaders, normalizeBearer } from '../src/headers.js';

describe('headers', () => {
  it('não sobrescreve chave já existente (case-insensitive)', () => {
    const result = ensureHeader({ Authorization: 'Bearer a' }, 'authorization', 'Bearer b');
    expect(result.Authorization).toBe('Bearer a');
  });

  it('merge preserva destino', () => {
    const merged = mergeHeaders({ Foo: '1' }, { foo: '2', Bar: '3' });
    expect(merged.Foo).toBe('1');
    expect(merged.Bar).toBe('3');
  });

  it('aplica headers padrão sem sobrescrever', () => {
    const out = applyStandardHeaders({ Authorization: 'Bearer legacy' }, {
      accessToken: 'xyz',
      empresaToken: 'abc',
      empresaId: '123',
      deviceId: 'dev',
      deviceHash: 'hash',
      usuarioId: 'u1',
    });
    expect(out.Authorization).toBe('Bearer legacy');
    expect(out['X-Empresa-Authorization']).toBe('Bearer abc');
    expect(out['Empresa-ID']).toBe('123');
    expect(out['X-Id-Dispositivo']).toBe('dev');
    expect(out['X-Hash-Agente']).toBe('hash');
    expect(out['X-Usuario-Id']).toBe('u1');
  });

  it('normaliza bearer', () => {
    expect(normalizeBearer('token')).toBe('Bearer token');
    expect(normalizeBearer('Bearer token')).toBe('Bearer token');
  });
});
