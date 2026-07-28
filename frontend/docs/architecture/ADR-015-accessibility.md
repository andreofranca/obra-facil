# ADR 015: Acessibilidade (a11y) como Requisito Não-Funcional

## Contexto
Plataformas web perdem até 20% de base de clientes se não forem acessíveis para pessoas com necessidades especiais (motoras ou visuais). Além disso, não aderir à WCAG prejudica o SEO.

## Decisão
Implementar a norma WCAG 2.2 AA como diretriz guia.
Automatizar a verificação usando a engine do `axe-core` embutida no `jest-axe` para testes unitários de componentes.
Adicionar inspeção E2E (via Playwright) para validação de navegação por teclado (`Tab`, `Enter`, `Escape`).

## Consequências
- Os modais e overlays globais requerem foco programático (`tabIndex`, `autoFocus`, `aria-modal="true"`).
- O desenvolvedor não poderá ignorar avisos de semântica HTML no linting nem testes de axe core falhando.
