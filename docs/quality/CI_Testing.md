# CI Testing Pipeline (Integração Contínua)

Este documento dita como a bateria de Qualidade é automatizada no ciclo de integração do ObraFácil, garantindo que nenhum ser humano precise rodar validações críticas manualmente antes de um merge.

## Etapas Obrigatórias na Pipeline

Todo Pull Request disparará uma pipeline em ambiente virtual isolado seguindo a ordem de execução estrita:

1. **Setup & Cache:** Configuração do Node.js, Next.js cache restoration e instalação de pacotes limpos (`npm ci`).
2. **Linting & Code Analysis:**
   - `npm run lint` (ESLint) - Falhas reprovam a build instantaneamente.
   - `npm run format:check` (Prettier) - Checagem estrutural visual.
3. **Type Checking:**
   - `tsc --noEmit` - Verifica tipagem de ponta a ponta sem buildar o Next.js.
4. **Infraestrutura Efêmera (Docker):**
   - Inicia contêiner local do PostgreSQL na esteira.
   - Aplica Schema do banco (`npx prisma migrate deploy` ou `prisma db push`).
5. **Teste Unitário e Integração:**
   - `npm run test:ci` - Bateria vitest/jest executando os testes da pirâmide (coleta cobertura de testes aqui).
6. **Teste E2E:**
   - Build da aplicação em modo produção (`npm run build`).
   - Start do server.
   - Execução das *specs* end-to-end (Cypress/Playwright).
7. **Quality Gate Assessment:**
   - Validação se as métricas descritas no `Coverage_Goals.md` foram atingidas.
   - Se o Quality Gate for aprovado, a PR é liberada para Code Review manual pela Liderança.

## Segurança
Qualquer vazamento de logs secretos durante o CI ou vulnerabilidades apontadas por auditorias autônomas do NPM bloqueiam o merge preventivamente.
