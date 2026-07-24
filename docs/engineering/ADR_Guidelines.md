# ADR Guidelines (Architecture Decision Records)

Este documento define como a equipe de engenharia do ObraFácil registrará as decisões arquiteturais significativas, garantindo alinhamento técnico e memória institucional.

## Como registrar decisões arquiteturais
1. Toda mudança estrutural, de banco de dados, escolhas de framework ou quebra de contrato de API exige a abertura de um ADR.
2. O documento deve ser armazenado na pasta `docs/adr/`.
3. O nome do arquivo deve seguir o formato `NNNN-titulo-curto.md` (onde NNNN é um número sequencial, ex: `0001-uso-de-redis-para-cache.md`).
4. Decisões requerem aprovação do Lead Engineer antes de seu status migrar para "Accepted".

## Modelo Padrão de ADR

Copie e preencha este template abaixo para novos ADRs:

```markdown
# ADR [NNNN]: [Título Curto e Descritivo]

## Status
- [ ] Proposed (Proposto)
- [ ] Accepted (Aceito)
- [ ] Rejected (Rejeitado)
- [ ] Superseded (Substituído)

## Contexto (Context)
Qual é a motivação, problema ou força motriz que exige uma decisão arquitetural? Descreva o estado atual e o que levou a esta discussão.

## Decisão (Decision)
O que foi decidido (ou o que está sendo proposto). Seja direto e específico sobre a tecnologia, padrão, ou alteração que está sendo estabelecida.

## Consequências (Consequences)
Quais são os impactos desta decisão no projeto? (Trade-offs)
- **Positivos:** Performance melhorada, facilidade de onboarding, segurança, etc.
- **Negativos:** Tempo extra de build, dependência de terceiros, quebra de contratos legados, necessidade de migração de dados.

## Revisores e Aprovação
- **Autor:** [Nome]
- **Revisor(es):** [Liderança/Equipe]
```
