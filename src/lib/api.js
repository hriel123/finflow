import { DEMO_TOKEN, demoRequest } from './demo.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  if (token === DEMO_TOKEN) return demoRequest(path, { method, body });

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return data;
}
