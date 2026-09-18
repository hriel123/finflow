# FinFlow

FinFlow é uma aplicação web de controle financeiro pessoal: dashboard de receitas e despesas, metas de economia, relatórios analíticos e configurações de perfil, categorias e preferências, com autenticação de usuário e persistência em banco de dados relacional.

## Stack

**Front-end**
- React 18 + Vite
- React Router
- Tailwind CSS
- Recharts (gráficos de barras, área e rosca)
- Lucide React (ícones)

**Back-end**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (autenticação) + bcrypt (hash de senha)

**Infraestrutura**
- Docker / Docker Compose (PostgreSQL)

## Funcionalidades

- Autenticação (registro e login) com JWT
- Dashboard com saldo, receitas, despesas e gráficos por período/categoria
- CRUD completo de transações, com filtros, busca e paginação
- Metas financeiras com acompanhamento de progresso
- Relatórios com evolução mensal, médias, maior despesa e taxa de economia
- Configurações de perfil, categorias personalizadas e preferências (tema e moeda)

## Estrutura do projeto

```
finflow/
├── src/            # Front-end (React)
├── backend/        # API (Express + Prisma)
│   ├── prisma/     # Schema e migrations
│   └── src/        # Rotas, middlewares, entrypoint
└── docker-compose.yml
```

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm

## Como rodar localmente

### 1. Banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL (`postgres:15-alpine`) na porta `5432`, com o banco `finflow`.

### 2. Back-end

```bash
cd backend
cp .env.example .env   # ajuste os valores se necessário
npm install
npx prisma migrate dev
npm run dev
```

A API sobe em `http://localhost:3001`.

### 3. Front-end

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` (ou na próxima porta livre, caso essa já esteja em uso).

## Variáveis de ambiente

**Front-end** (raiz, veja `.env.example`):

| Variável       | Descrição                                              |
|----------------|----------------------------------------------------------|
| `VITE_API_URL` | URL base da API. Padrão: `http://localhost:3001`         |

**Back-end** (`backend/.env`, veja `backend/.env.example`):

| Variável       | Descrição                                    |
|----------------|-----------------------------------------------|
| `DATABASE_URL` | String de conexão do PostgreSQL (Prisma)      |
| `PORT`         | Porta da API (padrão `3001`)                  |
| `JWT_SECRET`   | Segredo usado para assinar os tokens JWT      |

## Scripts disponíveis

**Front-end** (raiz)
- `npm run dev` — servidor de desenvolvimento (Vite)
- `npm run build` — build de produção
- `npm run preview` — pré-visualiza o build de produção

**Back-end** (`backend/`)
- `npm run dev` — servidor de desenvolvimento com reinício automático (nodemon)
- `npm start` — inicia o servidor sem reinício automático
- `npm run deploy` — aplica as migrations pendentes (`prisma migrate deploy`) e inicia o servidor; usado em produção

## Deploy gratuito (Vercel + Render + Neon)

Stack sem custo, pensada para compartilhar um link público:

- **Front-end:** [Vercel](https://vercel.com) (plano Hobby)
- **Back-end:** [Render](https://render.com) — Web Service gratuito (entra em modo de espera após ~15 min sem acesso; a primeira requisição depois disso demora de 30 a 60s para "acordar")
- **Banco de dados:** [Neon](https://neon.tech) — PostgreSQL gratuito permanente, com scale-to-zero automático (reativa sozinho, sem ação manual)

### 1. Banco (Neon)
1. Crie um projeto gratuito em [neon.tech](https://neon.tech).
2. Copie a *connection string* fornecida (formato `postgresql://usuario:senha@host/banco?sslmode=require`).

### 2. Back-end (Render)
1. Crie um **Web Service** no [Render](https://render.com), conectando o repositório do GitHub.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run deploy`
5. Variáveis de ambiente no painel do Render:
   - `DATABASE_URL` → a connection string do Neon
   - `JWT_SECRET` → uma string aleatória longa
   - `PORT` → o Render define automaticamente; não é necessário configurar
6. Após o deploy, copie a URL pública gerada (ex: `https://finflow-backend.onrender.com`).

### 3. Front-end (Vercel)
1. Importe o mesmo repositório no [Vercel](https://vercel.com).
2. **Root Directory:** raiz do projeto (onde está este README)
3. Variável de ambiente: `VITE_API_URL` → a URL do back-end no Render (passo anterior)
4. Deploy. A URL pública gerada pelo Vercel é o link para compartilhar.
