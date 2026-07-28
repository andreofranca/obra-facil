# Execution Template

Todo novo EPIC (Funcionalidade de Negócio ou Capability de Plataforma) deve ser executado seguindo o ciclo de vida abaixo.

## Fase 1: Planejamento
- Compreensão do objetivo de negócio.
- Consulta aos ADRs e Technical Debt Register.
- Desenho da Solução e identificação das Capabilities necessárias.
- **Aprovação da Architecture Review Board (ARB).**

## Fase 2: Implementação
- Uso estrito das diretrizes contidas em `CAPABILITY_STANDARDS.md` (para infraestrutura).
- TDD/BDD encorajados.
- Criação e atualização das documentações associadas (ADRs).

## Fase 3: Quality Gate
- Execução obrigatória de:
  - `npm run lint`
  - `npm run build`
  - `npm run test`

## Fase 4: Entrega Oficial (Relatório)
Toda entrega deverá seguir obrigatoriamente a seguinte estrutura:

1. **Executive Summary**
2. **Implementação**
3. **Quality Gate**
4. **Riscos Identificados**
5. **Trade-offs**
6. **Limitações Conhecidas**
7. **Dívida Técnica Identificada**
8. **Melhorias Propostas**
9. **ROI das Melhorias**
10. **Próximas Recomendações**
