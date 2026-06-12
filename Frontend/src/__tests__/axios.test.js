import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('axios interceptor - Authorization header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('agrega Bearer token cuando existe en localStorage', async () => {
    localStorage.setItem('token', 'mi-token-seguro-123');

    const axios = await import('axios');
    const api = axios.default.create({ baseURL: 'http://localhost:3001/api' });

    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const handler = api.interceptors.request.handlers[0];
    const config = handler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer mi-token-seguro-123');
  });

  it('NO agrega header si no hay token', async () => {
    const axios = await import('axios');
    const api = axios.default.create({ baseURL: 'http://localhost:3001/api' });

    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const handler = api.interceptors.request.handlers[0];
    const config = handler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('no modifica otras propiedades del config', async () => {
    localStorage.setItem('token', 'x');
    const axios = await import('axios');
    const api = axios.default.create({ baseURL: 'http://localhost:3001/api' });

    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const handler = api.interceptors.request.handlers[0];
    const config = handler.fulfilled({ headers: { 'Content-Type': 'application/json' } });

    expect(config.headers['Content-Type']).toBe('application/json');
    expect(config.headers.Authorization).toBe('Bearer x');
  });
});
