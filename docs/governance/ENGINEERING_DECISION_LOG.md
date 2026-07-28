# Engineering Decision Log

Este documento é o histórico executivo da engenharia, utilizado para registrar de forma unificada decisões altamente relevantes da plataforma (geralmente aquelas referendadas pela Architecture Review Board).

| ID | Data | Decisão | Justificativa | Impacto Esperado |
|:---|:---|:---|:---|:---|
| EDL-001 | 2026-07-28 | Padronizar Observabilidade via Platform Capability. | Eliminar `console.log` isolados, garantir mascaramento de PII e cross-context tracing por toda a base de código antes da transição de escala. | Maior segurança, facilidade de depuração em produção, desacoplamento de SDKs de provedores externos (ex: Datadog, Prometheus). |
| EDL-002 | 2026-07-28 | Adoção do Engineering Operating System (EOS). | Padronizar o ciclo de desenvolvimento, entrega e registro de Capabilities para escalar o time sem perder a qualidade base do projeto. | Redução de débitos técnicos acidentais e maior maturidade arquitetural a longo prazo. |
| EDL-003 | 2026-07-28 | Autonomia de Engenharia através da Authority Matrix. | Reduzir gargalos de aprovação e interrupções durante o "flow" do desenvolvedor para itens não-arquiteturais. | Aumento drástico de produtividade e qualidade do código por permitir "Silent Improvements" orgânicos. |
