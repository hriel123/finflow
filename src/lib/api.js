import { DEMO_TOKEN, demoRequest } from './demo.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Render's free plan puts the API to sleep when idle and the first request can
// take up to a minute. After 4 s waiting, ServerWakeNotice shows a notice.
let pending = 0;
let slowTimer = null;
let wakingSince = null;
const wakeListeners = new Set();

function setWaking(since) {
  wakingSince = since;
  wakeListeners.forEach((fn) => fn(since));
}

export function onServerWaking(fn) {
  wakeListeners.add(fn);
  fn(wakingSince);
  return () => wakeListeners.delete(fn);
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  if (token === DEMO_TOKEN) return demoRequest(path, { method, body });

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  pending += 1;
  if (pending === 1) {
    const start = Date.now();
    slowTimer = setTimeout(() => setWaking(start), 4000);
  }
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } finally {
    pending -= 1;
    if (pending === 0) {
      clearTimeout(slowTimer);
      if (wakingSince) setWaking(null);
    }
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return data;
}
