# Padrão de Métricas

O ObraFácil implementa métricas seguindo o padrão de abstração `IMetricsCollector`. Isso garante que não há acoplamento rígido ao Prometheus, Datadog ou OpenTelemetry ainda nesta fase.

## Instrumentos Disponíveis
- **Counter**: Conta ocorrências (ex: `http_requests_total`). Útil para medir throughput.
- **Gauge**: Mede valor absoluto em um ponto do tempo (ex: `active_connections`, `memory_usage`).
- **Histogram**: Coleta amostras e calcula percentis de distribuição (ex: `response_size`).
- **Timer**: Especialização do Histogram focado em tempo de duração (ex: `http_request_duration`).

## Utilização
```typescript
import { metrics } from "@/platform/observability";

// Incrementar um contador de negócio
metrics.incrementCounter("business_proposal_accepted", 1, { profissionalId: "123" });

// Medir duração de um fluxo customizado
const stop = metrics.startTimer("db_query_duration", { table: "Proposta" });
await database.query(...);
stop();
```
