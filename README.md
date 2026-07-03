# ObraFácil

ObraFácil é uma plataforma marketplace que conecta clientes a profissionais de construção, reformas e manutenção residencial.

## Arquitetura

- Frontend e backend integrados em uma aplicação Next.js App Router.
- APIs internas implementadas com Route Handlers no Next.js.
- ORM Prisma com PostgreSQL para persistência de dados.
- Autenticação customizada usando cookies HTTP-only assinados.
- UI em React + TypeScript + Tailwind CSS.

## Stack Utilizada

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma 6
- PostgreSQL
- Cloudinary (uploaded feature prevista)

## Estrutura de Pastas

- `frontend/` - aplicação principal com rotas, APIs, componentes e tipagens.
- `frontend/src/app/` - páginas e handlers de API.
- `frontend/src/components/` - componentes reutilizáveis.
- `frontend/src/lib/` - bibliotecas e autenticação.
- `frontend/src/types/` - tipos TypeScript compartilhados.
- `frontend/prisma/` - schema Prisma e migrations.
- `backend/` - presente no repositório, atualmente vazio.
- `docs/` - documentação do projeto.

## Instalação

```bash
cd frontend
npm install
```

## Execução Local

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Comandos Úteis

- `npm run dev` - inicia a aplicação em modo de desenvolvimento.
- `npm run build` - executa a build de produção.
- `npm run start` - inicia a aplicação em modo de produção.
- `npm run lint` - executa o ESLint.
- `npx prisma format -- --schema=prisma/schema.prisma` - formata o schema Prisma.
- `npx prisma generate -- --schema=prisma/schema.prisma` - gera o Prisma Client.
- `npx prisma migrate status` - verifica o estado das migrations.

## Roadmap Resumido

- MVP: cadastro de cliente, busca de profissionais, solicitação de serviço, painel de profissional, chat e propostas.
- Próximas etapas: aceite de proposta, avaliação de profissionais, favoritar, geolocalização e orçamento.

## Sprints Implementadas

- Sprint 01: Infraestrutura Next.js, Prisma, PostgreSQL.
- Sprint 02: Categorias e API de categorias.
- Sprint 03: Profissionais e filtro por categoria.
- Sprint 04: Solicitação de serviços e área do cliente.
- Sprint 05: Cadastro, login e sessão por cookie.
- Sprint 06: Painel do profissional, dashboard de solicitações e atualização de status.
- Sprint 06.1: Ajuste estrutural do marketplace com vínculo profissional nas solicitações.
- Sprint 07: Chat cliente ↔ profissional.
- Sprint 08.1: Sistema de propostas.
- Sprint Técnica 08.1.1: estabilização técnica e organização do projeto.
