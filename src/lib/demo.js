// Modo demonstração: responde às mesmas rotas da API com dados de exemplo
// guardados só neste navegador, para quem quer conhecer o FinFlow sem criar
// conta. Nada é enviado ao servidor.

export const DEMO_TOKEN = 'demo';

const STORAGE_KEY = 'finflow_demo';

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDay(d);
}

function monthsAhead(n) {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return isoDay(d);
}

// Lançamentos dos últimos meses, com datas relativas a hoje para os
// gráficos e relatórios sempre terem conteúdo.
function seed() {
  const now = new Date().toISOString();
  const tx = [];
  let id = 1;
  for (let m = 0; m < 4; m++) {
    const base = m * 30;
    const add = (description, category, type, amount, offset) =>
      tx.push({ id: id++, description, category, type, amount: String(amount), date: `${daysAgo(base + offset)}T12:00:00.000Z`, createdAt: now });
    add('Salário', 'Salário', 'income', 4800, 2);
    add('Aluguel', 'Moradia', 'expense', 1350, 3);
    add('Supermercado', 'Alimentação', 'expense', 420 + m * 35, 6);
    add('Conta de luz', 'Moradia', 'expense', 138 + m * 9, 9);
    add('Transporte por aplicativo', 'Transporte', 'expense', 96 + m * 12, 11);
    add('Restaurante', 'Alimentação', 'expense', 74 + m * 10, 14);
    add('Cinema', 'Entretenimento', 'expense', 58, 17);
    if (m % 2 === 0) add('Projeto freelance', 'Freelance', 'income', 950, 19);
    if (m === 1) add('Farmácia', 'Saúde', 'expense', 112, 21);
    if (m === 2) add('Curso online', 'Educação', 'expense', 199, 23);
    add('Rendimento da poupança', 'Investimentos', 'income', 42 + m * 3, 26);
  }
  tx.sort((a, b) => b.date.localeCompare(a.date));

  const goal = (gid, title, description, category, icon, target, current, months) => ({
    id: gid, title, description, category, icon, targetAmount: String(target), currentAmount: String(current),
    deadline: `${monthsAhead(months)}T12:00:00.000Z`, createdAt: now,
  });

  return {
    user: { id: 0, name: 'Visitante', email: 'demonstracao@finflow.app' },
    nextId: id + 100,
    transactions: tx,
    goals: [
      goal(id + 1, 'Viagem de férias', 'Passagens e hospedagem', 'Viagem', 'plane', 6000, 2350, 8),
      goal(id + 2, 'Reserva de emergência', 'Seis meses de gastos', 'Reserva', 'piggyBank', 15000, 9200, 14),
      goal(id + 3, 'Notebook novo', '', 'Tecnologia', 'laptop', 4500, 3900, 3),
    ],
    categories: [{ id: id + 4, name: 'Pets', type: 'expense', createdAt: now }],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // dados corrompidos ou armazenamento bloqueado: recomeça do exemplo
  }
  const data = seed();
  save(data);
  return data;
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sem armazenamento: a demonstração vale só enquanto a aba estiver aberta
  }
}

export function clearDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nada a limpar
  }
}

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function toDate(value) {
  return value ? `${String(value).slice(0, 10)}T12:00:00.000Z` : undefined;
}

export async function demoRequest(path, { method = 'GET', body = {} } = {}) {
  const data = load();
  const [, resource, rawId, action] = path.split('?')[0].split('/');
  const id = Number(rawId);
  const list = data[resource];

  if (resource === 'auth') {
    if (method === 'PUT') data.user = { ...data.user, name: body.name, email: body.email };
    save(data);
    return data.user;
  }
  if (!list) fail(404, 'resource not found');

  const index = list.findIndex((item) => item.id === id);
  if (rawId && index === -1) fail(404, 'resource not found');

  if (method === 'GET') return rawId ? list[index] : list;

  if (method === 'DELETE') {
    list.splice(index, 1);
    save(data);
    return null;
  }

  if (resource === 'goals' && action) {
    const goal = list[index];
    const current = Number(goal.currentAmount);
    const next = action === 'deposit' ? current + body.amount : Math.max(0, current - body.amount);
    goal.currentAmount = String(next);
    save(data);
    return goal;
  }

  const fields = { ...body };
  if (fields.date) fields.date = toDate(fields.date);
  if (fields.deadline) fields.deadline = toDate(fields.deadline);
  if (fields.amount !== undefined) fields.amount = String(fields.amount);
  if (fields.targetAmount !== undefined) fields.targetAmount = String(fields.targetAmount);
  if (fields.currentAmount !== undefined) fields.currentAmount = String(fields.currentAmount);

  if (method === 'POST') {
    if (resource === 'categories' && list.some((c) => c.name === body.name && c.type === body.type)) {
      fail(409, 'category already exists');
    }
    const created = { id: data.nextId++, createdAt: new Date().toISOString(), currentAmount: resource === 'goals' ? '0' : undefined, ...fields };
    if (created.currentAmount === undefined) delete created.currentAmount;
    if (resource === 'categories') list.push(created);
    else list.unshift(created);
    if (resource === 'transactions') list.sort((a, b) => b.date.localeCompare(a.date));
    save(data);
    return created;
  }

  list[index] = { ...list[index], ...fields };
  if (resource === 'transactions') list.sort((a, b) => b.date.localeCompare(a.date));
  save(data);
  return list[index];
}
