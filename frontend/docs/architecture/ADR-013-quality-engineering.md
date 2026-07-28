# ADR 013: Quality Engineering Foundation (QEF)

## Contexto
O projeto carecia de uma estrutura formal de garantia de qualidade (QA) integrada ao fluxo de desenvolvimento do frontend. Testes existiam apenas em formato de integração para o backend via Vitest + Prisma.

## Problema
Sem uma fundação de engenharia de qualidade (QEF), cada nova funcionalidade adicionada ou refatorada corre o risco de introduzir regressões ou quebrar componentes existentes (como os recentemente introduzidos pela Platform Layer). 

## Decisão
Implementar a QEF definindo e configurando infraestrutura para testes unitários, testes de componentes, testes de integração simulada e testes End-to-End (E2E), unindo também Acessibilidade (a11y) e Performance.

## Consequências
- **Positivas**: Protege o produto contra regressões. Obriga desenvolvedores a pensarem em testabilidade. Documenta o comportamento do sistema por meio de specs (TDD/BDD).
- **Negativas**: Aumenta o tempo de entrega inicial de componentes, pois exige a escrita dos testes e mocks. Aumenta a complexidade do CI/CD, que agora roda múltiplos *quality gates*.
