# APPLICATION LAYOUT AUDIT
**Date:** 2026-08-07
**Status:** PMO REJECTED -> ROOT CAUSE IDENTIFIED

## Descobrindo por que o ApplicationShell apresentou falhas
O `ApplicationShell` ESTÁ sendo chamado pelo `(authenticated)/layout.tsx`. 
No entanto, os componentes clientes renderizados dentro das páginas (Dashboard do Cliente e do Profissional) mantinham sua própria infraestrutura de layout (Sidebar e Header hardcoded).
Como resultado, a aplicação renderizava dois Sidebars e dois Headers simultaneamente, causando a quebra do layout observada pelo PMO.

## Respostas Obrigatórias:

- **Quais layouts estão ativos:** 
  - `src/app/layout.tsx` (Global)
  - `src/app/(authenticated)/layout.tsx` (ApplicationShell)
  - Layouts *hardcoded* dentro de `ClientePedidosClient.tsx` e `ProfissionalPedidosClient.tsx` (`<aside>` e `<header>`).

- **Quais layouts não estão sendo utilizados:**
  - `AppLayout.tsx`, `AuthLayout.tsx`, `DashboardLayout.tsx`, `Header.tsx`, e `Footer.tsx` (Estes foram agora **DELETADOS** do sistema).

- **Quais páginas ainda usam Header antigo:**
  - As páginas públicas (`/page.tsx`, `/loading.tsx`, `/not-found.tsx`, `/cadastro`, `/login`) possuíam referências ao `<Header />` que foram removidas.
  - O dashboard `/profissional/pedidos` possuía um `<header>` interno.
  - O dashboard `/meus-pedidos` possuía um `<header>` interno.

- **Quais páginas ainda usam Footer antigo:**
  - As páginas públicas possuíam referências removidas. Nenhuma página autenticada o utilizava diretamente (porém o Footer foi deletado do repositório para evitar uso futuro).

- **Quais páginas ainda estão fora do Route Group (authenticated):**
  - Estritamente as páginas de autenticação (`/login`, `/cadastro`) e a landing page `/page.tsx`. Todas as páginas restritas já se encontram adequadamente envelopadas pela pasta `(authenticated)`.
