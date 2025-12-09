import { describe, it, expect } from 'vitest';
import { buildDeviceHeaders } from '../src/deviceContext.js';

describe('deviceContext', () => {
  it('monta headers apenas com dados presentes', () => {
    const headers = buildDeviceHeaders({ id: 'dev1', hash: 'h1', nome: 'phone', idioma: 'pt-BR' });
    expect(headers['X-Id-Dispositivo']).toBe('dev1');
    expect(headers['X-Hash-Agente']).toBe('h1');
    expect(headers['X-Nome-Dispositivo']).toBe('phone');
    expect(headers['X-Idioma-Padrao']).toBe('pt-BR');
  });

  it('não explode em ambiente sem navigator', () => {
    expect(() => buildDeviceHeaders()).not.toThrow();
  });
});
