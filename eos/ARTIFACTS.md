# Artefatos Oficiais (Official Artifacts)

## Visão Geral

Artefatos são documentos estruturados, registros e códigos produzidos sistematicamente ao longo do Ciclo de Vida. Eles servem como a única fonte de verdade para a Máquina de Estados validar a progressão do trabalho e para auditoria futura. 

A formatação e existência destes artefatos é compulsória.

## Catálogo de Artefatos

### 1. Implementation Plan (Plano de Implementação)
- **Descrição**: Documento macro que detalha "o que" será feito, "por que" será feito, e a abordagem técnica proposta.
- **Fase de Origem**: `PLANNING`
- **Uso**: Guiar a fase de aprovação e execução.

### 2. Task (Tarefa de Execução)
- **Descrição**: Unidade atômica de trabalho contendo especificações técnicas granulares, critérios de aceite e rastreabilidade para o *Implementation Plan*.
- **Fase de Origem**: `EXECUTING`
- **Uso**: Controle de granularidade de progresso diário.

### 3. Checkpoint Report (Relatório de Ponto de Controle)
- **Descrição**: Registro do estado da execução em momentos pré-determinados, avaliando riscos, impedimentos e métricas de saúde do processo em andamento.
- **Fase de Origem**: `CHECKPOINT`
- **Uso**: Correção de rota e mitigação precoce de riscos.

### 4. Engineering Report (Relatório de Engenharia)
- **Descrição**: Resumo consolidado de métricas técnicas, desafios enfrentados, soluções aplicadas e débitos técnicos assumidos durante o desenvolvimento.
- **Fase de Origem**: `CERTIFICATION`
- **Uso**: Avaliação de qualidade global da engenharia do produto.

### 5. Validation Report (Relatório de Validação)
- **Descrição**: Documento que comprova a execução e os resultados da suíte de testes (manuais e automatizados), demonstrando a cobertura de requisitos.
- **Fase de Origem**: `TESTING`
- **Uso**: Autorizar a transição para a fase de Certificação.

### 6. Project Status (Status do Projeto)
- **Descrição**: Painel ou documento atualizado dinamicamente que reflete a saúde geral, o estado atual e o percentual de conclusão do escopo.
- **Fase de Origem**: Contínuo (Atualizado do `PLANNING` ao `COMPLETED`)
- **Uso**: Visibilidade executiva e alinhamento de stakeholders.

### 7. Changelog (Registro de Alterações)
- **Descrição**: Listagem cronológica, categorizada e legível por humanos de todas as modificações, adições, remoções e correções incluídas na versão.
- **Fase de Origem**: `DOCUMENTATION` / `VERSIONING`
- **Uso**: Comunicação clara com usuários finais e times de operação.

### 8. Roadmap (Mapa de Evolução)
- **Descrição**: Projeção temporal e estratégica das entregas futuras, épicos e marcos de alto nível do produto ou sistema.
- **Fase de Origem**: `PLANNING`
- **Uso**: Alinhamento de visão de longo prazo e priorização.

### 9. Decision Log (Registro de Decisões)
- **Descrição**: Diário contínuo registrando escolhas gerenciais, mudanças de escopo, negociações de prazo e aprovações críticas.
- **Fase de Origem**: Contínuo
- **Uso**: Resolução de conflitos e auditoria de gestão.

### 10. ADR (Architecture Decision Record)
- **Descrição**: Registro imutável documentando uma decisão arquitetural significativa, incluindo seu contexto, as alternativas consideradas, a decisão final e suas consequências (trade-offs).
- **Fase de Origem**: `DOCUMENTATION` (ou mediante identificação no `EXECUTING`)
- **Uso**: Memória técnica e integração de novos membros técnicos, garantindo a sustentabilidade da arquitetura ao longo do tempo.

## Conformidade e Validação

Nenhum artefato pode ser considerado válido se não atender ao padrão formal estabelecido pela governança do sistema. O Motor de Execução (*Execution Engine*) tem a autoridade para rejeitar transições de estado caso um artefato obrigatório esteja ausente, obsoleto ou fora do formato estipulado.
