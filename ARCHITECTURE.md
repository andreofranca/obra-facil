# Arquitetura — ObraFácil

## Arquitetura Geral

ObraFácil é uma aplicação web monolítica organizada como um frontend Next.js (App Router) que consome um backend leve (implementado como rotas API dentro do mesmo projeto). A persistência é feita em PostgreSQL usando Prisma como ORM.

Componentes principais:
- Frontend: Next.js 16 (App Router), React + TypeScript, TailwindCSS
- Backend/API: Rotas API do Next.js (serverless functions), Prisma Client
- Banco: PostgreSQL

## Frontend

- Padrão: App Router com Server Components e Client Components onde necessário
- Pastas principais: `src/app/` (rotas/pages), `src/components/` (UI reutilizável), `src/lib/` (helpers), `src/types/` (tipagens)
- Estilo: TailwindCSS

## Backend

- Rotas de API implementadas em `src/app/api/`
- Uso de `PrismaClient` diretamente nas rotas de API e em server components quando necessário
- Autorização leve baseada em sessão por cookie implementada em `src/lib/auth.ts`

## Banco

- PostgreSQL com migrations gerenciadas por Prisma
- Models principais: `User`, `Cliente`, `Profissional`, `SolicitarServico`, `Proposta`, `MensagemSolicitacao`, `Avaliacao`, `Servico`, `CategoriaServico`

## Prisma

- Prisma Client gerado e versionado localmente
- Migrations existem em `prisma/migrations/` e não devem ser alteradas nesta sprint

## Autenticação

- Sessão armazenada em cookie HTTP-only assinado
- Helpers: `getAuthSession()`, `createSessionCookieValue()`, `parseSessionCookieValue()`

## Fluxo de Solicitação

1. Cliente cria `SolicitarServico` com título/descrição e, opcionalmente, `profissionalId`.
2. Profissionais podem enviar `Proposta` para a solicitação.
3. Cliente avalia propostas e pode aceitar uma; aceitação atualiza a solicitação para `EM_ANDAMENTO`.

## Fluxo de Contratação

1. Profissional envia proposta (`POST /api/propostas`).
2. Cliente visualiza propostas em `/minhas-propostas`.
3. Cliente aceita proposta via `PATCH /api/propostas/[id]` — operação transacional que marca a proposta como `ACEITA`, marca as demais como `RECUSADA` e atualiza a solicitação para `EM_ANDAMENTO`.

## Fluxo de Chat

- Chat implementado por mensagens ligadas à `SolicitarServico` com API em `/api/solicitacoes/[id]/mensagens`.

## Fluxo de Propostas

- Criação: `POST /api/propostas`
- Listagem: `GET /api/propostas`
- Aceite/Recusa: `PATCH /api/propostas/[id]`

## Padrões adotados

- Reutilização de componentes em `src/components`
- Tipagem completa em TypeScript, evitar `any`
- Uso de `prisma.$transaction` para operações atômicas

## Organização das pastas

- `src/app/` — rotas e páginas
- `src/components/` — componentes React
- `src/lib/` — utilitários e autenticação
- `src/types/` — definições de tipos compartilhados

## Boas práticas

- Evitar URLs absolutas para chamadas internas (`/api/...`)
- Executar `npm run lint` e `npm run build` antes de commits significativos
- Manter regras de negócio no backend e autorização centralizada

## Decisões arquiteturais

- Projeto mantido como monólito Next.js para acelerar desenvolvimento e deploys
- Prisma escolhido por produtividade e maturidade com PostgreSQL

## Convenções de nomenclatura

- Pastas e arquivos em kebab-case para rotas; componentes em PascalCase

## Padrão das APIs

- REST simples via rotas Next.js, JSON payloads, status HTTP apropriados

## Estratégia de versionamento

- Versionamento semântico para releases (tags `vMAJOR.MINOR.PATCH`)
