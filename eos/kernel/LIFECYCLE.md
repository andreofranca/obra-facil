# Ciclo de Vida (Lifecycle)

## Visão Geral

O Ciclo de Vida define a trajetória canônica, sequencial e inalterável que toda entidade executável (projetos, tarefas, features) deve seguir. Pular etapas é expressamente proibido pela governança do sistema.

## Estados Oficiais

A progressão deve ocorrer na ordem exata apresentada abaixo:

### 1. PLANNING (Planejamento)
Onde a necessidade é analisada e estruturada.
- **Objetivo**: Definir viabilidade, recursos necessários e estratégia de execução.
- **Saída Crítica**: *Implementation Plan* e documentação de arquitetura inicial.

### 2. APPROVED (Aprovado)
O marco de autorização formal.
- **Objetivo**: Garantir que todas as partes interessadas concordaram com o escopo e orçamento definidos na fase anterior.
- **Saída Crítica**: Assinatura/Aprovação registrada e liberação para execução.

### 3. EXECUTING (Em Execução)
A fase de construção ou desenvolvimento ativo.
- **Objetivo**: Transformar o plano em artefatos concretos (código, infraestrutura, designs).
- **Saída Crítica**: Artefatos primários desenvolvidos (*Tasks* concluídas).

### 4. CHECKPOINT (Ponto de Controle)
Avaliação intermediária de progresso e alinhamento.
- **Objetivo**: Garantir que a execução não se desvie dos objetivos originais. Permite correções de rota antes que o custo de mudança seja alto.
- **Saída Crítica**: *Checkpoint Report* e ajustes de cronograma.

### 5. QUALITY_GATE (Portão de Qualidade)
Análise estática e verificações de conformidade.
- **Objetivo**: Assegurar que os padrões de codificação, segurança e arquitetura foram seguidos antes de testes dinâmicos.
- **Saída Crítica**: Relatórios de Análise Estática, Linters e Cobertura.

### 6. TESTING (Testes)
Validação dinâmica do comportamento da solução.
- **Objetivo**: Comprovar que os requisitos funcionais e não-funcionais foram atendidos na prática.
- **Saída Crítica**: *Validation Report*, Resultados de Testes Unitários e de Integração.

### 7. CERTIFICATION (Certificação)
Aprovação final de qualidade para liberação.
- **Objetivo**: Validação por um auditor independente (ou processo automatizado rigoroso) atestando que o entregável está pronto para produção/uso geral.
- **Saída Crítica**: Selo de Certificação, *Engineering Report* consolidado.

### 8. DOCUMENTATION (Documentação)
Registro do conhecimento.
- **Objetivo**: Atualizar base de conhecimento, manuais de usuário, guias de operação e registros de decisões técnicas.
- **Saída Crítica**: *ADR (Architecture Decision Record)*, Guias, *Changelog* preliminar.

### 9. VERSIONING (Versionamento)
Empacotamento e marcação da entrega.
- **Objetivo**: Atribuir identificadores únicos, criar tags de release e empacotar os artefatos para implantação.
- **Saída Crítica**: Notas de Lançamento definitivas, Artefatos de Release.

### 10. COMPLETED (Concluído)
A implantação ou entrega formal foi finalizada com sucesso.
- **Objetivo**: Declarar que a solução está ativa e entregue ao usuário final ou ambiente de destino.
- **Saída Crítica**: *Project Status* atualizado para "Entregue".

### 11. ARCHIVED (Arquivado)
Fim do ciclo de vida útil ou fechamento administrativo do projeto.
- **Objetivo**: Congelar os artefatos e dados para retenção histórica e auditoria futura. Nenhuma nova modificação é permitida sem iniciar um novo ciclo de vida.
- **Saída Crítica**: Repositório/Pacote marcado como Somente Leitura (Read-Only).

## Política de Não Evasão (No Skipping Policy)

Sob nenhuma circunstância o Motor de Execução permitirá que um estado seja transposto sem que seus critérios de saída sejam integralmente atendidos. Tentar forçar o avanço (por exemplo, de `EXECUTING` direto para `COMPLETED`) resultará em erro fatal de execução, e o processo será bloqueado até a devida regularização.
