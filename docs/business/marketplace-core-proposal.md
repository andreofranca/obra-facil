# Marketplace Core Proposal

## 1. Objetivos da Capability
A Capability **Marketplace Core** é o coração do negócio da plataforma ObraFácil. Ela orquestra a descoberta, negociação e contratação de serviços entre Clientes e Profissionais. Diferente das *Capabilities* de Plataforma (horizontais), esta é uma *Capability* de Domínio (vertical) que encapsula as regras de negócio intrínsecas ao modelo de marketplace de serviços.

## 2. Limites (Boundaries)
- **O que faz:**
  - Gerenciamento do ciclo de vida de Solicitações de Serviço (`SolicitarServico`).
  - Gerenciamento do ciclo de vida de Propostas (`Proposta`).
  - Orquestração de Categorias e Listagem de Profissionais.
  - Aplicação de regras de autorização de domínio (ex: apenas o dono da solicitação pode aceitar uma proposta).
- **O que não faz:**
  - Não gerencia processamento financeiro, retenção ou repasse (delega para a *Payments Foundation*).
  - Não envia e-mails ou push notifications diretamente (delega para a *Notifications Capability*).
  - Não realiza processamento de jobs assíncronos pesados (delega para a *Operations Capability*).

## 3. Domain Services (Interfaces Públicas)
O core do marketplace deve expor os seguintes serviços de domínio, desacoplando a lógica de negócio das rotas (Next.js API Routes):
- `ServiceRequestDomainService`: Criação, atualização de escopo e cancelamento de solicitações.
- `ProposalDomainService`: Envio, edição e listagem de propostas.
- `ContractingDomainService`: O serviço orquestrador. Lida com o *Aceite* e *Recusa* atômicos, coordenando mudanças de estado entre Solicitações e Propostas simultaneamente.

## 4. State Machines do Domínio
O fluxo de contratação obedece a regras de estado estritas:
- **Solicitação (`SolicitacaoStatus`):** `ABERTA` → `PROPOSTAS` / `NEGOCIACAO` → `ACEITA` → `EM_EXECUCAO` → `CONCLUIDA`. (Com estados de exceção: `CANCELADA`, `EXPIRADA`, `RECUSADA`).
- **Proposta (`PropostaStatus`):** `PENDENTE` → `ACEITA` ou `RECUSADA`. (Com estados de exceção: `CANCELADA`, `EXPIRADA`).

> **Regra de Transição Atômica (RN014 & RN015):** Ao aceitar uma proposta (`PENDENTE` → `ACEITA`), a Solicitação migra para `EM_ANDAMENTO`/`EM_EXECUCAO` e TODAS as demais propostas vinculadas migram de `PENDENTE` para `RECUSADA` em uma única transação de banco de dados (`prisma.$transaction`).

## 5. Integração com Capabilities da Plataforma
- **Payments:** O aceite de uma proposta no *Marketplace Core* invoca o `PaymentService.charge()` para realizar o bloqueio do valor (Escrow).
- **Notifications:** Mudanças de estado disparam eventos (ex: *ProposalAcceptedEvent*) que a *Capability* de Notificações escuta para alertar o profissional e os concorrentes recusados.
- **Security:** Validação de *ownership* estrita. Clientes só atuam em suas solicitações. Profissionais só atuam em suas propostas.
- **Analytics & Observability:** Rastreamento do funil de conversão (Solicitação Criada → Propostas Recebidas → Proposta Aceita).

## 6. Trade-offs
- **Acoplamento Transacional vs. Event-Driven:** O aceite de uma proposta altera múltiplas entidades. Optou-se por consistência forte (Transação de BD local) para as mudanças de status (Proposta Vencedora + Propostas Perdedoras + Solicitação) e consistência eventual (Eventos) para domínios externos (Notificação/Pagamento) a fim de evitar bloqueios prolongados.
- **Modelagem Relacional:** Uso intensivo de chaves estrangeiras no PostgreSQL garante integridade referencial, em detrimento de uma flexibilidade de esquema NoSQL, o que é adequado para o rigor exigido nos vínculos Cliente-Serviço-Profissional.

## 7. Risk Map
| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Race Conditions (Dois aceites simultâneos) | Alto | Baixa | Uso de concorrência otimista e `prisma.$transaction` para garantir que apenas uma proposta possa ser aceita por solicitação. |
| Vazamento de Dados (Visibilidade de propostas) | Crítico | Média | Implementação de Data Access Objects (DAOs) e Middlewares que forçam injeção do ID do usuário nas cláusulas `WHERE` de leitura. |
| Gargalo no Aceite (Muitas propostas para recusar) | Médio | Baixa | A atualização em lote (`updateMany`) mitigará o peso no BD ao marcar as propostas perdedoras. |
