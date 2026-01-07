import { describe, it, expect } from 'vitest';
import { shouldLogout, shouldSuppressNotFound, isEmpresaMismatch } from '../src/errorPredicates.js';

describe('errorPredicates', () => {
  it('detecta logout por 401/403', () => {
    expect(shouldLogout({ response: { status: 401 } })).toBe(true);
    expect(shouldLogout({ response: { status: 403 } })).toBe(false);
    expect(shouldLogout({ response: { status: 403, data: { detail: 'token inválido' } } })).toBe(true);
    expect(shouldLogout({ response: { status: 500 } })).toBe(false);
  });

  it('suprime 404 quando configurado', () => {
    expect(shouldSuppressNotFound({ response: { status: 404 }, config: { suppressNotFound: true } })).toBe(true);
    expect(shouldSuppressNotFound({ response: { status: 404 } })).toBe(false);
  });

  it('detecta mismatch de empresa por mensagem', () => {
    expect(isEmpresaMismatch({ response: { status: 403, data: { detail: 'token da empresa inválido' } } })).toBe(true);
    expect(isEmpresaMismatch({ response: { status: 403, data: { error: 'empresa não encontrada' } } })).toBe(true);
    expect(isEmpresaMismatch({ response: { status: 400, data: { error: 'empresa' } } })).toBe(false);
  });
});
