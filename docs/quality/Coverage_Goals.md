# Metas de Cobertura (Coverage Goals)

O rastreamento de cobertura não serve como meta-fim (chasing 100%), mas sim como termômetro de saúde para não permitir que o código do ObraFácil perca confiabilidade nas Sprints futuras.

## Metas Oficiais Mínimas
- **Lines (Linhas Gerais):** Mínimo de 80%.
- **Statements (Declarações):** Mínimo de 80%.
- **Functions (Funções):** Mínimo de 85%.
- **Branches (Ramificações Lógicas):** Mínimo de 75%.

## Regras Práticas
1. **Regra de Não-Regressão:** O Pull Request não pode diminuir a porcentagem total do projeto (ou seja, se a baseline do projeto estiver em 82%, a PR não pode abaixar a cobertura sem que as ferramentas do CI bloqueiem o merge).
2. **Código de UI Burra vs Regra de Negócio:**
   - Métodos utilitários genéricos, cálculos matemáticos, formatadores e Hooks vitais exigem 100% de cobertura (Unitária).
   - Componentes visuais extremamente fluidos (Next.js server/client components dependentes pesadamente de layout CSS) podem ser dispensados de cobertura total se cobertos pelo espectro dos testes E2E.

## Ferramental
A cobertura será reportada através da configuração do Jest/Vitest em formato lcov/text-summary rodando na pipeline do GitHub Actions, fornecendo visibilidade direta na própria PR.
