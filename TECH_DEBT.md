# Dívida Técnica — ObraFácil

Lista de pendências técnicas conhecidas, separadas por prioridade.

## ALTA

- Testes automatizados (unitários + E2E)
- Pipeline CI que execute lint, build e testes
- Testes de concorrência para endpoints transacionais (aceite de propostas)
- Auditoria de segurança e correções de vulnerabilidades reportadas pelo `npm audit`

## MÉDIA

- Dockerização para ambiente de desenvolvimento e produção
- Monitoramento e observabilidade (logs estruturados, métricas)
- Implementar caching para endpoints de listagem (ex.: categorias)

## BAIXA

- Refatoração de componentes para maior reuso
- Melhoria de UX e mensagens de erro padronizadas

## Exemplos (a considerar)

- `npm audit` reportou vulnerabilidades que devem ser avaliadas
- Implementar testes E2E (Playwright) cobrindo fluxo de contratação
- Criar job de CI (GitHub Actions) para validar PRs
