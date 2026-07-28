# Technical Radar

Mapeamento oficial das tecnologias utilizadas no ObraFácil, indicando seu status de adoção e visão de futuro.

## 1. Adopt (Em uso, consolidado e padrão recomendado)
- **Linguagem:** TypeScript
- **Framework:** Next.js (App Router, Turbopack)
- **Estilização:** TailwindCSS + Radix UI
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Formulários:** React Hook Form + Zod
- **Testes:** Vitest + React Testing Library

## 2. Trial (Em avaliação ou adoção inicial)
- **Observabilidade:** Abstrações ILogger nativas (Datadog/Grafana previstos para integração via Platform).

## 3. Assess (Sendo estudado para o futuro)
- **Mensageria Assíncrona:** Redis Pub/Sub ou SQS para processamento de background jobs.
- **Microservices:** Desmembramento do Marketplace vs Plataforma Core se o monolito atingir o teto térmico.

## 4. Hold (Restrito ou não recomendado)
- Rest APIs antigas em Express. O uso do Next.js App Router API e Server Actions é mandatório.
- Bibliotecas de log engessadas (winston acoplado sem interface).
