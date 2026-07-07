# ObraFácil

ObraFácil é uma plataforma marketplace que conecta clientes e profissionais da construção, reformas e manutenção residencial, permitindo a publicação de solicitações, negociação por propostas e acompanhamento de serviços.

## Visão Geral

O projeto segue um modelo monolítico com Next.js, onde frontend, rotas de API e lógica de sessão convivem no mesmo repositório. A aplicação já cobre o fluxo principal de marketplace, com cadastro de usuários, autenticação por cookie, cadastro de solicitações, painel do profissional, chat e sistema de propostas.

## Stack Tecnológica

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma 6
- PostgreSQL
- Cookie-based session customizada com assinatura HMAC

## Arquitetura Atual

- Frontend e backend integrados em uma única aplicação Next.js App Router.
- APIs internas implementadas com Route Handlers em `frontend/src/app/api`.
- Persistência com Prisma e PostgreSQL.
- Sessão autenticada por cookie HTTP-only assinado.
- A autenticação e a autorização foram centralizadas em módulos reutilizáveis para facilitar manutenção e expansão.

## Nova Estrutura de Autenticação

A Sprint 09.1 consolidou a camada de sessão e autorização em:

- `frontend/src/lib/auth/session.ts`: criação, parsing e validação do cookie de sessão.
- `frontend/src/lib/auth/guards.ts`: guards de autenticação e autorização por perfil.
- `frontend/src/lib/auth.ts`: camada compatível que reexporta a lógica centralizada.

## Funcionalidades Implementadas

- Cadastro e login de usuários.
- Sessão persistente por cookie HTTP-only.
- Fluxo completo de solicitação de serviço.
- Área do cliente e painel do profissional.
- Chat entre cliente e profissional.
- Sistema de propostas com aceite e recusa.
- Atualização de status de solicitação e início de serviço pelo profissional contratado.

## Estrutura de Diretórios Atualizada

- `frontend/` - aplicação principal.
- `frontend/src/app/` - páginas e rotas de API.
- `frontend/src/components/` - componentes reutilizáveis.
- `frontend/src/lib/` - utilidades compartilhadas e camada de autenticação.
- `frontend/src/types/` - tipagens do projeto.
- `frontend/prisma/` - schema, migrations e seed.
- `docs/` - documentação técnica e de produto.
- `backend/` - pasta presente no repositório, sem uso ativo no momento.

## Status do Projeto

- Sprint 09.1 concluída com foco em hardening da autenticação e da sessão.
- Lint e build do frontend executados com sucesso após a integração.
- O projeto segue avançado no MVP, com o fluxo principal já implementado e a próxima etapa concentrada em reforço de autorização e preparação para a Sprint 09.2.

## Progresso do MVP

- MVP funcional em andamento com fluxo principal já coberto.
- Estimativa de conclusão do MVP: aproximadamente 80%.
- Estimativa de maturidade para a versão 1.0: aproximadamente 60%.

## Roadmap Resumido

- Curto prazo: reforço de autorização, proteção de rotas e validações adicionais de sessão.
- Médio prazo: estabilização de fluxo de contratação, melhorias de UX e expansão de cobertura de testes.
- Longo prazo: avaliações de profissionais, geolocalização, favoritos e evolução para uma versão 1.0 mais robusta.

## Comandos Úteis

- `npm run dev` - inicia a aplicação em modo de desenvolvimento.
- `npm run build` - executa a build de produção.
- `npm run start` - inicia a aplicação em modo de produção.
- `npm run lint` - executa o ESLint.
- `npx prisma format -- --schema=prisma/schema.prisma` - formata o schema Prisma.
- `npx prisma generate -- --schema=prisma/schema.prisma` - gera o Prisma Client.
- `npx prisma migrate status` - verifica o estado das migrations.
