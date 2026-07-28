# Health Checks & Readiness

Para garantir altíssima disponibilidade, a plataforma adota o padrão Kubernetes de Liveness e Readiness.

## `/api/health`
**Propósito:** Liveness Probe.
- Verifica apenas se o processo do Node.js está vivo e respondendo a tráfego HTTP.
- Responde com status `200 OK` contendo Uptime e Versão.
- Se não responder, o orquestrador (K8s) pode matar e reiniciar o Pod.

## `/api/ready`
**Propósito:** Readiness Probe.
- Verifica se a aplicação tem plenas condições de receber e processar requisições completas de negócio.
- Consulta o banco de dados via `SELECT 1` (Prisma) e verifica integridade das variáveis de ambiente (`DATABASE_URL`).
- Se falhar, o status se torna `503 Service Unavailable`. O orquestrador deve remover o tráfego desta instância temporariamente sem reiniciá-la, aguardando que o banco restabeleça.

Ambos endpoints utilizam a plataforma `withObservability`, o que significa que métricas e latências de heath check já são nativamente medidas.
