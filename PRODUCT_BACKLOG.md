# PRODUCT_BACKLOG

## Resumo
Documento de Product Discovery focado no Épico 2 — Execução do Serviço. Contém épicos existentes, detalhamento do fluxo de execução pós-contratação e divisão em sprints 09.1–09.3.

## Épicos

### ÉPICO 01
Cadastro

Status:
Concluído

Funcionalidades entregues:
- Registro de usuários (cliente/profissional)
- Login e sessão por cookie
- Perfil básico de usuário

---

### ÉPICO 02
Marketplace

Status:
Concluído

Funcionalidades entregues:
- Listagem de profissionais e serviços
- Categorias de serviço
- Busca/filtragem por categoria

---

### ÉPICO 03
Contratação

Status:
Concluído

Funcionalidades entregues:
- Criação de solicitação (`SolicitarServico`)
- Envio de propostas por profissionais (`Proposta`)
- Listagem de propostas para cliente e profissional
- Aceite/recusa de propostas (fluxo inicial implementado)

---

### ÉPICO 04
Execução do Serviço

Status:
Em planejamento

Objetivo:
- Definir o fluxo completo de execução após a aceitação da proposta, cobrindo estados do serviço, responsabilidades de atores e integrações necessárias.

Fluxo completo (alto nível):
1. Cliente aceita proposta → Solicitação passa a `EM_ANDAMENTO` e vencedora fica `ACEITA`.
2. Profissional inicia trabalho (opção: marcar "Iniciar") → registro de data/hora de início.
3. Profissional comunica progresso e envia evidências (opcional: fotos, anexos).
4. Profissional marca serviço como concluído → solicitação muda para `AGUARDANDO_CONFIRMACAO` (ou estado similar).
5. Cliente revisa evidências e confirma conclusão → solicitação muda para `FINALIZADO`.
6. Caso o cliente recuse, iniciar processo de disputa/retorno (fluxo de exceção) ou permitir correções pelo profissional.

Atores:
- Cliente (owner da solicitação)
- Profissional (contratado)
- Admin (moderação, logs, resolução de disputa)

Regras de negócio (principais):
- RN-EX-01: Somente o cliente dono da solicitação pode confirmar conclusão.
- RN-EX-02: Após aceite, apenas o profissional contratado pode marcar início/encerramento do serviço.
- RN-EX-03: Aceite de proposta é irreversível pelo cliente sem processo de disputa; ações adicionais exigem intervenção (Admin) ou novo acordo.
- RN-EX-04: Somente quando a solicitação estiver em `EM_ANDAMENTO` o profissional pode reportar progresso.
- RN-EX-05: Evidências de conclusão (opcional) devem ser armazenadas com referência temporal.
- RN-EX-06: Timeouts/SLAs: se o profissional não iniciar em X dias, notificar cliente e sugerir alternativas.

Casos de uso (exemplos):
- UC-01: Iniciar Serviço — Profissional marca início; registro de timestamp.
- UC-02: Reportar Progresso — Profissional adiciona mensagem/foto ao chat ou campo de progresso.
- UC-03: Marcar Conclusão — Profissional envia evidências e marca como concluído.
- UC-04: Confirmar Conclusão — Cliente verifica e confirma finalização.
- UC-05: Recusar Conclusão — Cliente recusa e solicita correções; estado volta para `EM_ANDAMENTO`.
- UC-06: Disputa — Cliente/Profissional abrem disputa; Admin intervém.

Critérios de aceite (por caso):
- CA-01 (Iniciar Serviço): Registro de início salvo com timestamp e usuário correto.
- CA-02 (Concluir): Evidências anexadas (quando aplicável) e notificação enviada ao cliente.
- CA-03 (Confirmar): Estado `FINALIZADO` aplicado e histórico de eventos gravado.
- CA-04 (Recusa): Comentário de recusa gravado e notificação ao profissional.

Impacto na arquitetura:
- Necessidade de endpoints adicionais para marcar início/conclusão do serviço e anexar evidências.
- Melhor integração entre chat e eventos de progresso (possível unificação de mensagens de status).
- Armazenamento de arquivos/anexos (S3 ou blob storage) — planejar provider.
- Regras de autorização reforçadas (checar sessões e ownership nas rotas).

Impacto no banco:
- Novo campo(s) em `SolicitarServico`: `startedAt`, `finishedAt`, `statusHistory` (ou tabela `ServiceEvents`).
- Tabela ou campos para anexos (`ServiceEvidence`) referenciando `SolicitarServico` e `Proposta`.
- Logs de auditoria para eventos críticos (início/conclusão/aceite/recusa).

Impacto nas APIs:
- POST /api/solicitacoes/[id]/start — marcar início (profissional)
- POST /api/solicitacoes/[id]/evidence — anexar evidência (profissional)
- POST /api/solicitacoes/[id]/finish — marcar conclusão (profissional)
- POST /api/solicitacoes/[id]/confirm — confirmar conclusão (cliente)
- POST /api/solicitacoes/[id]/dispute — abrir disputa (cliente/profissional)
- GET /api/solicitacoes/[id]/events — histórico de eventos

Impacto na UX:
- Novas ações nos fluxos do cliente e profissional: botões "Iniciar", "Marcar Conclusão", "Confirmar Conclusão".
- Tela de progresso com timeline de eventos e evidências anexadas.
- Notificações (in-app / email) para eventos críticos.

Dependências:
- Storage para anexos (S3/Blob) e política de retenção
- Sistema de notificações (email / in-app)
- Admin panel para resolução de disputas
- Política de SLAs e parâmetros configuráveis

Riscos:
- Falta de testes de concorrência em operações críticas (início/conclusão)
- Armazenamento de evidências aumenta custo e complexidade
- UX ambígua em caso de recusa/medidas de correção
- Necessidade de moderação/fluxo de disputa para evitar abusos

Subdivisão em sprints

Sprint 09.1
- Especificação detalhada do modelo de dados (campos em `SolicitarServico`, tabelas `ServiceEvents`/`ServiceEvidence`).
- APIs para iniciar serviço e anexar evidências (contratos, sem implementação nesta sprint — apenas spec).
- UI/UX mockups das telas: timeline do serviço, ações de profissional/cliente.
- Critérios de teste e casos de aceitação definidos.

Sprint 09.2
- Especificação das APIs para marcar conclusão e confirmar conclusão (contratos e payloads).
- Definição de políticas de notificações e SLAs.
- Fluxo de disputa e papel do admin (spec).

Sprint 09.3
- Plano de armazenamento de evidências (provider, custos, retenção).
- Planejamento de testes de concorrência e integração.
- Roadmap de implementação e estimativas.

---

### ÉPICO 05
Experiência do Usuário

Planejamento
- Avaliações (nota, comentário, média)
- Favoritos (cliente favoritar profissional)
- Dashboard Cliente (serviços ativos, histórico, propostas, avaliações)
- Dashboard Profissional (serviços ativos, histórico, receita estimada, avaliação média)

---

### ÉPICO 06
Administração

Planejamento
- Painel Admin
- Relatórios
- Logs
- Moderação / resolução de disputas

---

### ÉPICO 07
Versão 1.0

Planejamento
- Docker
- CI/CD
- Testes (unitários + E2E)
- Deploy
- Produção

---

## Entrega
Arquivo criado: `PRODUCT_BACKLOG.md`

***
