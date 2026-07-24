# Estratégia de Testes (Testing Strategy)

Este documento dita como a equipe do ObraFácil testa o sistema, os padrões esperados de cada ciclo e as responsabilidades na esteira de Continuous Integration.

## Níveis de Validação

### 1. Checagem Estática e Tipagem
- **O quê:** TypeScript e ESLint.
- **Onde atua:** No pré-commit (husky) e na CI.
- **Papel:** Evita que falhas de digitação, imports incorretos e variáveis indefinidas cheguem às fases de testes executáveis.

### 2. Testes de Unidade (Unit Tests)
- **O quê:** Validam funções isoladas, regras de negócio puras e utilitários.
- **Ferramentas Típicas:** Jest / Vitest.
- **Foco:** Funções de cálculo de propostas, hooks React customizados, máscaras e validadores de input, mockando dependências (como Prisma).

### 3. Testes de Integração (Integration Tests)
- **O quê:** Avaliam as rotas da API (Next.js App Router) comunicando-se com o Banco de Dados.
- **Ferramentas Típicas:** Supertest + Vitest/Jest integrado ao Prisma.
- **Foco:** Confirmar se as queries (N+1 removidos, indexação) e regras de autorização/papéis atuam corretamente em um banco de dados PostgreSQL efêmero (subido via Docker).

### 4. Testes End-to-End (E2E)
- **O quê:** Testam a interface do usuário e os fluxos críticos de negócio navegando pela plataforma.
- **Ferramentas Típicas:** Cypress ou Playwright.
- **Foco:** Caminho feliz de cadastro de profissional, login e aceite de propostas. Devem rodar contra uma base PostgreSQL espelhada (containerizada) e zerada.

## Abordagem de Shift-Left
Encorajamos a abordagem "Shift-Left": trazer os testes e a garantia de qualidade o mais para o início possível no ciclo de desenvolvimento, durante a fase de PR, evitando atrasos ao fim da Sprint.
