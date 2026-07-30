# Capability Registry

Este documento serve como o catálogo oficial de todas as *Capabilities* (capacidades) da plataforma ObraFácil, estabelecendo governança, ownership e rastreabilidade sobre a evolução da infraestrutura.

## Plataforma: Observability
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Nenhuma (Agnóstica)
- **Próxima Evolução:** Implementar exportadores remotos (OTel, Datadog) e migrar o Masking para Worker Threads/FluentBit.

*(As próximas Capabilities, como Data Foundation, serão registradas aqui conforme forem homologadas pela Architecture Review Board).*

## Plataforma: Analytics
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability, Operations
- **Próxima Evolução:** Adicionar Client-Side React Tracking via Context e integrar provedor real (PostHog).

## Plataforma: Notifications
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability, Operations
- **Próxima Evolução:** Acoplar AWS SES ou SendGrid via `NodeMailerProvider` e adicionar suporte real a _In-App Notifications_ via Data Foundation.

## Plataforma: Operations
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability
- **Próxima Evolução:** Acoplar o JobQueue ao Redis/BullMQ ou AWS SQS.

## Plataforma: Performance
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability
- **Próxima Evolução:** Implementar `RedisCacheProvider` para suportar instâncias Node distribuídas.

## Plataforma: Security
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability (Para Logging e Rastreamento)
- **Próxima Evolução:** Adicionar um AuditProvider robusto conectado a um SIEM, e implementar Rate Limiting via Redis na Edge.

## Plataforma: Payments
- **Versão:** v1.0.0 (MVP)
- **Status:** Active
- **Owner:** Platform Engineering Team
- **Maturidade:** Level 1 (Foundation)
- **Dependências:** Observability, Operations, Security
- **Próxima Evolução:** Integração real com gateways de pagamento (ex: Stripe, PIX) e reconciliação financeira em lote.
