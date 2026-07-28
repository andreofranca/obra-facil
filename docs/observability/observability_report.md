# GOVERNANCE REVIEW: Observability Capability (EPIC 4.1)

## 1. Executive Summary
**Objetivo:** Estabelecer a primeira "Capability" oficial de plataforma (Observabilidade) para garantir rastreabilidade, padronização de logs, telemetria segura e captura rigorosa de erros antes do lançamento em produção, sustentando até 1 milhão de usuários.
**Implementação:** Criação de estrutura Platform (`src/platform/observability`), adoção rigorosa de interfaces (`ILogger`, `IMetricsCollector`), Error Handling padronizado (`BusinessError`, `InfrastructureError`), injeção de `x-correlation-id` na Edge (Proxy Middleware), context-tracking transparente (via IoC em Node) e re-padronização do `error.tsx` e `global-error.tsx`.
**Resultados:** Capability completa, retrocompatibilidade total com módulos antigos que dependiam de `src/lib/logger.ts`, lint/build/testes estáveis e prontidão para integração com Datadog/OTel no futuro.

## 2. Capability Maturity
- **Current Maturity:** Level 1 (Initial / MVP).
- **Implementado:** Abstrações ILogger, Contexto Isolado, Middleware injetor de IDs, Health Probes, Error Bounds e Métricas Mockadas.
- **Próxima Evolução:** Integração com DataDog/Grafana Loki (Level 2) e implementação OTLP para tracing distribuído.
- **Limitações Conhecidas:** Masking síncrono impacta escala brutal; falta exportador real para métricas.
- **Dependências:** Nenhuma dependência externa atualmente (Platform Agnostic).

## 3. Arquivos Criados
- `src/proxy.ts` (Next.js Middleware + Proxy logic)
- `src/app/global-error.tsx`
- `src/platform/observability/index.ts`
- `src/platform/observability/context/index.ts`
- `src/platform/observability/errors/index.ts`
- `src/platform/observability/errors/GlobalErrorBoundary.tsx`
- `src/platform/observability/health/index.ts`
- `src/platform/observability/logger/index.ts`
- `src/platform/observability/logger/ILogger.ts`
- `src/platform/observability/logger/ConsoleLogger.ts`
- `src/platform/observability/logger/MaskingService.ts`
- `src/platform/observability/metrics/index.ts`
- `src/platform/observability/tracing/index.ts`
- `src/platform/observability/middleware/withObservability.ts`
- `docs/architecture/ADR-019-observability-architecture.md`
- `docs/observability/*.md`

## 4. Arquivos Modificados
- `src/lib/logger.ts` (Refatorado para exportar da Plataforma garantindo retrocompatibilidade)
- `src/app/error.tsx` (Migrado para utilizar o logger da plataforma)
- `src/app/api/health/route.ts` (Utilizando HOC de observabilidade)
- `src/app/api/ready/route.ts` (Lançando InfrastructureError com withObservability)
- `src/components/solicitacao/ServiceWizard.tsx` (Refatoração de Lint / uso de `useWatch` do RHF)

## 5. Quality Gate
- **Lint:** Aprovado (0 errors, 12 warnings de variáveis não utilizadas no ambiente de dev).
- **Build:** Aprovado (Turbopack + Next.js build limpo).
- **Testes:** Aprovado (72/72 testes passando).

## 6. Senior Developer Review
- **Melhorias:** Inserção de Context Providers (`IoC`) contorna limitações estritas de bundling misto Server/Client do Next 14/15.
- **Débitos Técnicos:** O `MockMetricsCollector` não envia métricas para um Prometheus.
- **Oportunidades:** Substituir o `ConsoleLogger` por um Adaptador Pino usando `process.stdout.write` visando extrema performance.
- **Próximo EPIC recomendado:** Security Capability.

## 7. Platform Engineer Review
- **Componentes reutilizáveis:** `withObservability`, `GlobalErrorBoundary` e Abstrações de Logger.
- **Duplicação / Acoplamento:** Zero. A aplicação depende apenas de `ILogger`. `logger.ts` foi perfeitamente desacoplado do `context`.
- **Preparo para Crescimento:** O roteamento por Correlation ID garante que milhões de logs diários possam ser filtrados por transação (ex: Datadog APM).

## 8. Production Readiness Review
- **Impedimentos para Produção:** O banco precisa escalar vertical/horizontalmente; a observabilidade no código está pronta, mas os painéis Grafana/Datadog precisam ser instanciados no DevOps.
- **Métricas a coletar:** `http_requests_total`, `http_request_duration`, `active_users`, `db_latency`.
- **SPOFs:** O banco relacional.

## 9. Product Owner Review
- **Valor Entregue:** Transparência de plataforma. Se um cliente falhar ao submeter um pedido, o ID no console apontará exatamente a stack trace para o time de plantão.
- **Backlog Recomendado:**
  - *Must*: Painel Grafana consumindo `/api/metrics`.
  - *Should*: Alertas no Slack para `UnexpectedError`.

## 10. CTO Review
- **Custos / Lock-in:** Custo zero. Não há lock-in pois adotamos apenas interfaces (Nenhuma SDK do Datadog vazando pelo código).
- **Evolução p/ 1 Milhão:** O `MaskingService` é síncrono; ao atingir 1M de requisições por segundo, será recomendável passá-lo para Worker Threads ou implementá-lo nativamente no agregador de Logs via Regex (FluentBit/Vector).

## 11. Engineering Retrospective
- **Aprendizado:** As restrições Edge (Middleware) vs Node (Rotas API) vs Browser (Client Components) exigem cuidado imenso ao desenhar SDKs de plataforma no Next.js (TurboPack é sensível a mix de environments).
- **Melhoria de Processo:** A decisão de separar `proxy` (Edge) e `withObservability` (Node API Wrapper) revelou-se a estratégia arquitetural mais sólida.

## 12. Engineering Scorecard (0-10)
- **Arquitetura:** 9.5
- **Qualidade:** 9.0
- **Segurança:** 9.0 (Masking ativo)
- **Observabilidade:** 9.5
- **Documentação:** 10.0

## 13. Architecture Decision Proposals
- **Proposta 1 (Performance de Log):** Migrar `MaskingService` do backend Node para o agente de log (Vector/FluentBit) no Kubernetes, liberando CPU do Node.js.
- **Proposta 2 (Tracing):** Integrar SDK OTLP (OpenTelemetry) no `ITracer` em um EPIC subsequente de "Advanced SRE".
