import { DEMO_TOKEN, demoRequest } from './demo.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SERVER_ERROR_MESSAGES = {
  'invalid credentials': 'E-mail ou senha incorretos.',
  'invalid email format': 'Informe um e-mail válido.',
  'password must be at least 6 characters long': 'A senha deve ter pelo menos 6 caracteres.',
  'name, email and password are required': 'Preencha nome, e-mail e senha.',
  'email and password are required': 'Preencha e-mail e senha.',
  'email already registered': 'Este e-mail já está cadastrado.',
  'too many attempts, please try again later': 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  'email not configured': 'A recuperação de senha por e-mail ainda não foi ativada.',
  'invalid or expired reset link': 'Este link expirou ou já foi usado. Peça um novo em "Esqueci minha senha".',
  'token and password are required': 'Informe a nova senha.',
  'category already exists': 'Essa categoria já existe.',
  'text too long': 'O texto ficou longo demais. Encurte e tente de novo.',
  'amount too large': 'O valor máximo é R$ 99.999.999,99.',
  'invalid field type': 'Algum campo foi enviado em formato inválido.',
  'Failed to fetch': 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
  'NetworkError when attempting to fetch resource.': 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
  'Load failed': 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
};

export function translateServerError(message) {
  return SERVER_ERROR_MESSAGES[message] ?? message;
}

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
