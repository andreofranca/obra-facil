# ADR 014 & 017: Testing Strategy & Stack

*(Este documento funde a Estratégia [014] e a Escolha da Stack [017] para coesão)*

## Contexto
Precisávamos decidir a tecnologia para os testes Unitários, de Componentes e E2E, garantindo performance e compatibilidade com o ecossistema Next.js.

## Alternativas Consideradas
1. **Jest + React Testing Library** (Padrão ouro legado) + **Cypress** (E2E).
2. **Vitest + React Testing Library** + **Playwright** (E2E).

## Decisão
Aprovou-se oficialmente a **Alternativa 2**.
1. O projeto já possuía `vitest` para testes de integração no backend, logo, padronizamos o "runner" utilizando-o também para o Frontend. A velocidade superior do Vitest (esbuild) comparada ao Jest (Babel) é vantajosa.
2. Adotou-se `jsdom` (via Vite plugin react).
3. Adotou-se o `jest-axe` para verificações automatizadas de acessibilidade nos testes de componentes.
4. Adotou-se `Playwright` no lugar de Cypress por seu forte suporte a webkits paralelos e tabs.

## Consequências
- **Positivas**: Testes velozes. Um único test runner para frontend e backend (Vitest). Suporte cross-browser E2E superior com Playwright.
- **Negativas**: Dependências adicionais aumentam um pouco o tamanho da pasta `node_modules` e o setup inicial. Next.js App Router (server components) pode ser desafiador de testar puramente em Vitest sem mocks severos, necessitando frequentemente que o teste do fluxo real delegue para o Playwright.
