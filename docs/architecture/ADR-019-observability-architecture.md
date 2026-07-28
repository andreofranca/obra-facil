# ADR-019: Arquitetura de Observabilidade da Plataforma

## Status
Aprovado

## Contexto
O ObraFácil está na fase de Readiness para Produção. Atualmente, os logs eram feitos diretamente usando a infraestrutura do Vercel/Next.js (com instâncias simples de `console.log` e pequenos wrappers) e não possuíamos telemetria cruzada entre os módulos da requisição (falta de Correlation ID injetado do início ao fim), nem padrão unificado de respostas a erros.
O crescimento projetado de 10 mil para até 1 milhão de usuários exige que as falhas sistêmicas sejam reportadas proativamente a ferramentas como Datadog, Grafana Loki, e que erros de negócio não silenciem falhas graves (InfrastructureError).

## Decisão
Estabelecer a Capability de Observabilidade no formato de *Platform Engineering*, concentrando o código no módulo abstrato `src/platform/observability/`. 

- **Logger**: Passa a utilizar interfaces rígidas (`ILogger`), permitindo injeção de dependência e desacoplamento do `console` nativo futuramente para uso de `Pino` ou `Winston`.
- **Request Context**: Uso de `AsyncLocalStorage` para criar um boundary por requisição HTTP para a API (no runtime Node), isolando metadados de identificação.
- **Middleware Global**: Um `middleware.ts` no Next.js foi criado para propagar identificadores únicos na borda (Edge).
- **Error Handling**: Erros de domínio estruturados (`BusinessError`, `InfrastructureError`, etc.) para padronização de Status HTTP e criticidade.

## Consequências
### Positivas
- Rastreamento unificado de requisições de ponta a ponta (Tracing & Context).
- Segurança de dados sensíveis na camada base através do `MaskingService`.
- Prontidão para exportação OTLP (OpenTelemetry) com as abstrações de métricas.

### Negativas / Riscos
- Possível latência microscópica adicionada por verificações de `MaskingService` em logs massivos.
- O Edge Runtime limita o uso nativo de Node `AsyncLocalStorage`, exigindo propagação via HTTP Headers antes de instanciar o contexto nos Handlers da API Node.
