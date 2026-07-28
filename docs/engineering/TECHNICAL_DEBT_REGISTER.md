# Technical Debt Register

Catálogo de dívidas técnicas da plataforma, visando priorização de pagamento de acordo com o impacto no negócio.

| ID | Data | Descrição do Débito | Severidade | Impacto | Plano de Ação |
|:---|:---|:---|:---|:---|:---|
| TD-001 | 2026-07-28 | MaskingService síncrono para logs. | Média | CPU overhead em cenários de requisições super massivas (apenas em produção com mais de 1M req/s). | Extrair Masking para a ponta do agregador (FluentBit) ou WebWorker. |
| TD-002 | 2026-07-28 | MockMetricsCollector vazio. | Baixa | Nenhuma métrica real enviada a dashboards OTLP atualmente. | Implementar adaptadores OTLP e Prometheus na próxima fase de SRE. |
| TD-003 | 2026-07-28 | Prisma SQLite local em certos fluxos de Seed/Demostração. | Baixa | Não replica 100% o comportamento transacional massivo do Postgres em Produção. | Refatorar scripts de Seed para aceitarem Multi-Tenant de demonstração via Docker Compose. |
