# CI/CD no ObraFácil

Este documento descreve o fluxo de Integração Contínua (CI) e Entrega Contínua (CD) do projeto.

## Integração Contínua (CI)

A automação principal é feita pelo GitHub Actions.
Possuímos dois workflows principais para CI:

1. **Quality Gate (`quality-gate.yml`)**
   Executado em todos os *Pull Requests* para a `main`. Garante que nenhum código que quebre o build ou os testes seja mesclado.
   Executa:
   - `npm ci`
   - `npm run lint`
   - `npm run test`
   - `npm run build`

2. **Continuous Integration (`ci.yml`)**
   Executado após o merge no branch `main`. Além dos testes, roda a suíte de cobertura (Coverage) e guarda os artefatos para auditoria.

## Artefatos Publicados

- **Coverage**: Relatórios gerados pelo `vitest` em formato HTML/LCOV.
- **Test-Results**: Resultados dos testes.
- **Logs**: Em caso de quebras extremas, os logs do npm são salvos.

## Entrega Contínua (CD)

1. **Release Pipeline (`release.yml`)**
   Sempre que uma Tag no formato `vX.X.X` for criada, este pipeline é engatilhado. Atualmente preparado como um esqueleto (Placeholder) para integração futura com provedores de nuvem (Vercel, AWS ou Docker Registry).
