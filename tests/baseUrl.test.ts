import { describe, it, expect } from 'vitest';
import { normalizeBaseUrl, buildApiBaseUrl, withoutTrailingSlash, ensureTrailingSlash } from '../src/baseUrl.js';

describe('baseUrl', () => {
  it('remove sufixos /api e /api/v1', () => {
    expect(normalizeBaseUrl('https://host/api/v1')).toBe('https://host');
    expect(normalizeBaseUrl('https://host/api')).toBe('https://host');
  });

  it('preserva /api/vN quando a base já vem versionada', () => {
    expect(normalizeBaseUrl('https://host/api/v2')).toBe('https://host/api/v2');
    expect(buildApiBaseUrl('https://host/api/v2')).toBe('https://host/api/v2');
  });

  it('mantém base fallback quando vazio', () => {
    expect(normalizeBaseUrl('')).toBe('http://localhost:8000');
  });

  it('buildApiBaseUrl anexa /api/v1 apenas uma vez', () => {
    expect(buildApiBaseUrl('https://host')).toBe('https://host/api/v1');
    expect(buildApiBaseUrl('https://host/api/v1')).toBe('https://host/api/v1');
  });

  it('buildApiBaseUrl respeita apiPath customizado', () => {
    expect(buildApiBaseUrl('https://host', { apiPath: '/api/v2' })).toBe('https://host/api/v2');
  });

  it('normaliza trailing slash', () => {
    expect(withoutTrailingSlash('https://x/')).toBe('https://x');
    expect(ensureTrailingSlash('https://x')).toBe('https://x/');
  });
});
