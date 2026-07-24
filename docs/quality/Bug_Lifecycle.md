# Bug Lifecycle (Ciclo de Vida do Bug)

O ObraFácil exige um fluxo transparente e previsível para tratamento de defeitos descobertos. Este documento aborda o protocolo de resolução de bugs.

## Fases do Fluxo de Trabalho (Jira/Kanban)

### 1. Descoberta & Triage (New)
- **Origem:** QA, Monitoramento (Datadog/Sentry) ou Relatos de Usuários.
- **Ação:** O ticket é criado com severidade classificada (ex: Blocker, Critical, Major, Minor). Informações obrigatórias: *Passos para reproduzir, Comportamento esperado, Comportamento atual e Evidência (print/video).*

### 2. Análise & Diagnóstico (To Do / Backlog)
- Liderança prioriza o card. Engenheiro assina a tarefa e verifica localmente. Se não reproduzível, pede mais detalhes e move para "Need Info".

### 3. Em Correção (In Progress)
- O Desenvolvedor implementa o Hotfix/Patch.
- **Regra de Ouro:** *Nunca se conserta um bug sem antes escrever um teste falho comprovando a existência daquele bug.* Esse teste será a garantia de não-regressão futura.

### 4. Code Review
- Submissão da PR. Aprovadores verificam se a correção abordou a causa raiz e não apenas os sintomas superficiais.

### 5. Homologação (In QA / Testing)
- O ambiente de Staging (QA) é atualizado. Validação manual e execução das suítes de teste de regressão E2E completas.

### 6. Resolução (Done / Deployed)
- Após sinal verde do QA e Product Manager, o branch de correção entra no fluxo normal definido pelo `Release_Process.md` rumo a produção. A Issue é oficialmente encerrada.

## Tempo de Resposta (SLA Técnico)
- **Blockers (Queda do Next.js, Falha no DB):** Tempo de resposta e Patch Imediato.
- **Críticos (Bloqueio de Conversão P1):** Resolução na Sprint atual.
- **Demais (UI desalinhada, Minor glitches):** Triagem e priorização no backlog das Sprints subsequentes.
