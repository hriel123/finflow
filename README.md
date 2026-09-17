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

## Variáveis de ambiente (back-end)

Definidas em `backend/.env` (veja `backend/.env.example`):

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
