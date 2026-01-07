# @varjao/shared-http

Utilitários HTTP puros para os frontends Varjão (frontend, pocket, central). Remove duplicação de baseURL, headers e refresh dedupe sem alterar regras de negócio.

## Instalação

```bash
npm install git+https://github.com/Beowulfwar/varjao_shared_http.git#main
```

## Principais exports

```ts
import {
  normalizeBaseUrl,
  buildApiBaseUrl,
  applyStandardHeaders,
  ensureHeader,
  mergeHeaders,
  createRefreshCoordinator,
  shouldLogout,
  shouldSuppressNotFound,
  isEmpresaMismatch,
  buildDeviceHeaders,
  type AuthState,
} from '@varjao/shared-http';
```

## Uso rápido

### Base URL
```ts
const apiBase = buildApiBaseUrl(import.meta.env.VITE_API_URL); // preserva /api/vN, anexa /api/v1 quando necessario
const apiV2 = buildApiBaseUrl(import.meta.env.VITE_API_URL, { apiPath: '/api/v2' });
```

### Headers idempotentes
```ts
const headers = applyStandardHeaders(existing, {
  accessToken: usuarioToken,
  empresaId,
  deviceId,
  deviceHash,
  usuarioId,
});
// use headers no axios/fetch sem sobrescrever valores existentes
```

### Refresh dedupe
```ts
const refreshCoordinator = createRefreshCoordinator({
  usuario: refreshUsuario,
  mobile: refreshMobile,
});
// dentro do interceptor 401
return refreshCoordinator.refreshUsuario().then(() => retry());
```

### Predicados de erro
```ts
if (shouldLogout(error)) { /* limpar sessão */ }
if (shouldSuppressNotFound(error)) { return error.response; }
```

### Device headers (seguro para SSR)
```ts
const deviceHeaders = buildDeviceHeaders({ id: 'device-id', hash: 'hash' });
```

## Scripts
- `npm run build` — compila para `dist/` com declarações `.d.ts`
- `npm test` — testes unitários (Vitest)

## Filosofia
- Puro TypeScript, sem dependências de React/DOM/Axios.
- Tree-shakeable: funções pequenas, sem estado global.
- Sem alteração de regras de negócio; apenas infraestrutura HTTP.
