# Estratégia de Branching (Git Flow Simplificado)

## Branches Principais

- `main` (ou `master`): Contém o código pronto para produção (ou a base beta consolidada). É uma branch protegida. Commits diretos são proibidos; apenas via PRs aprovados no Quality Gate.

## Branches de Trabalho

1. **Feature (`feature/*`)**
   Usadas para desenvolver novas funcionalidades (Épicos ou Stories).
   *Exemplo*: `feature/service-wizard`

2. **Bugfix/Hotfix (`bugfix/*` ou `hotfix/*`)**
   Usadas para corrigir bugs encontrados em desenvolvimento (bugfix) ou produção (hotfix).
   *Exemplo*: `bugfix/date-parser-overflow`

3. **Refactor (`refactor/*`)**
   Usadas exclusivamente para reescrita de código que não altera comportamento (Clean Code, remoção de dívidas).
   *Exemplo*: `refactor/remove-any-types`

## Políticas de Merge

- Todos os Pull Requests devem ter o status verde (Lint, Build e Testes passando).
- Revisão de Código (Code Review) é mandatória baseada no `QUALITY_CHECKLIST.md`.
- Merge preferencial: `Squash and Merge` para manter o histórico da `main` limpo, ou `Rebase`.
