# Guia de Qualidade (Quality Guide)

O Quality Guide complementa a estratégia de testes ao orientar *como* o desenvolvedor deve agir perante novos desenvolvimentos.

## Como Escrever Testes?
1. **Behavior-Driven**: Não teste a implementação (ex: nome da variável interna). Teste o comportamento visível pelo usuário ou o output da função.
2. **Setup Enxuto**: Use o `beforeEach` e o `setupTests.ts` para dados recorrentes.
3. **Mocks Cuidadosos**: Faça mock estrito nas barreiras de I/O (Requisições HTTP, Timers nativos, Objetos Window).

## Cobertura e Métricas
Não buscamos ilusórios 100% de coverage que muitas vezes inflam os mocks. Buscamos:
- **100% nas Helpers e Validations**. O motor (Platform Layer) não pode falhar.
- Alta cobertura em componentes reaproveitáveis (`src/components/ui/` e `feedback/`).
- Foco cirúrgico no E2E nos fluxos vitais.

## Quality Gates Locais
Antes de um PR ser criado, o dev deve executar:
```bash
npm run test:coverage
npm run lint
npm run build
```
O build limpo valida se o Next.js consegue gerar estaticamente as páginas sem dependências quebradas de servidor/cliente.
