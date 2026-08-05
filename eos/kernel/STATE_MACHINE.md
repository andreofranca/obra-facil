# Máquina de Estados (State Machine)

## Visão Geral

A Máquina de Estados governa a transição de fases dentro do ecossistema. Ela assegura que um processo só avance quando um conjunto estrito de critérios (entradas) for validado e resultar em entregáveis específicos (saídas).

## Regras da Máquina de Estados

1. **Transições Unidirecionais e Determinísticas**: Um estado só pode evoluir para estados subsequentes pré-definidos, ou retornar a um estado anterior específico em caso de falha ou revisão. Transições arbitrárias são bloqueadas.
2. **Atomicidade de Estado**: O sistema encontra-se em um, e apenas um, estado oficial em qualquer momento dado.
3. **Imutabilidade Condicional**: Artefatos gerados em estados consolidados tornam-se imutáveis e só podem ser alterados através de novas iterações, gerando um novo versionamento.

## Estrutura de Transição

Para cada transição de estado, as seguintes propriedades devem ser estritamente observadas:

- **Entradas (Inputs)**: Artefatos, permissões, e pré-condições necessárias para iniciar o processamento no estado atual.
- **Saídas (Outputs)**: Artefatos atualizados, novos documentos gerados e métricas de qualidade.
- **Responsabilidades (Responsibilities)**: Os atores, sistemas ou agentes incumbidos de executar o trabalho naquele estado.
- **Documentos Produzidos**: A lista oficial de artefatos que atestam a conclusão bem-sucedida das atividades do estado atual.

## Tabela de Responsabilidades e Artefatos (Genérica)

| Estado de Origem | Gatilho | Entradas Exigidas | Documentos Produzidos (Saída) | Responsabilidade |
| :--- | :--- | :--- | :--- | :--- |
| `PLANNING` | Início de Demanda | Escopo preliminar, Objetivos | *Implementation Plan*, *Roadmap* | Equipe de Planejamento |
| `EXECUTING` | Aprovação do Plano | *Implementation Plan* aprovado | *Task*, Código/Implementação | Engenharia / Desenvolvimento |
| `CHECKPOINT` | Intervalo de Execução | Implementação Parcial | *Checkpoint Report* | Liderança / Automação |
| `QUALITY_GATE` | Fim da Execução | Implementação Completa | Relatórios de Qualidade | QA / Automação de Testes |
| `DOCUMENTATION`| Qualidade Aprovada | Implementação Validada | *ADR*, Atualização de Manuais | Engenharia / Tech Writers |

*(Nota: Para a lista completa e sequencial dos estados oficiais do ciclo de vida, consulte o [LIFECYCLE.md](./LIFECYCLE.md)).*

## Bloqueios e Retrocessos

Se, durante a avaliação de um estado (ex: `QUALITY_GATE`), as saídas não atenderem aos padrões exigidos, a Máquina de Estados forçará o retrocesso do processo para o estado de correção adequado (ex: retornando a `EXECUTING` ou `PLANNING`), exigindo nova passagem pelos critérios de validação.
