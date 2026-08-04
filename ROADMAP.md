# Roadmap v1.0 - ObraFácil (Product Evolution)

## 1. Introdução e Visão Geral
Este roadmap define a evolução oficial do ObraFácil para a fase de *Product Evolution*. Baseado no backlog do MVP e nas diretrizes de arquitetura de negócios (Marketplace Core e Payments Foundation), as funcionalidades estão organizadas em EPICs, com prioridades e dependências técnicas bem definidas.

## 2. EPICs Estratégicos

### EPIC 1: Gestão de Identidade e Perfis (Identity & Profiles)
- **Escopo:** Cadastro e autenticação de clientes e profissionais. Edição de perfis, gerenciamento de portfólio e categorias.
- **Valor:** Base para entrada de usuários e retenção de profissionais qualificados.

### EPIC 2: Descoberta e Catálogo (Discovery)
- **Escopo:** Busca avançada de profissionais com filtros por cidade e categoria, visualização do perfil detalhado e contato inicial.
- **Valor:** Permitir que o cliente encontre a mão de obra correta rapidamente.

### EPIC 3: Marketplace Core (Negociação e Contratos)
- **Escopo:** Criação de solicitações de serviço (`SolicitarServico`), envio de orçamentos/propostas, máquina de estados atômica (Aceite/Recusa) e transição de status para execução.
- **Valor:** Transformar a plataforma de um simples "catálogo" em um intermediador transacional.

### EPIC 4: Motor de Pagamentos e Escrow (Payments Foundation)
- **Escopo:** Integração de pagamentos com bloqueio de valor (Escrow), garantindo a retenção financeira no aceite da proposta e o repasse após a conclusão da obra.
- **Valor:** Garantir a confiança mútua e a monetização do produto.

### EPIC 5: Mensageria e Notificações (Communications)
- **Escopo:** Disparo de notificações transacionais baseadas em eventos de domínio, chat interno seguro e envio de alertas para concorrentes recusados.
- **Valor:** Manter o engajamento e a transparência em todo o ciclo de vida do serviço, eliminando a dependência de aplicativos externos.

### EPIC 6: Governança, Segurança e Observabilidade (Admin & Platform)
- **Escopo:** Painel de gestão de usuários e categorias. Proteção contra vazamento de dados, controle de *ownership* rigoroso (DAOs) e rastreamento do funil de conversão.
- **Valor:** Operação segura, estável e escalável.

---

## 3. Prioridades e Dependências Técnicas

| EPIC | Prioridade | Dependências Técnicas |
| :--- | :--- | :--- |
| **EPIC 1** (Identity) | **P1 (Crítica)** | Nenhuma. Fundação do sistema. |
| **EPIC 2** (Discovery) | **P1 (Crítica)** | Depende do EPIC 1 (Perfis populados para busca). |
| **EPIC 6** (Admin & Platform)| **P2 (Alta)** | Paralelo ao EPIC 1. Requer banco de dados estruturado, RBAC e observabilidade. |
| **EPIC 3** (Marketplace Core)| **P2 (Alta)** | Depende do EPIC 1 e 2. Requer controle de concorrência e autorização robusta. |
| **EPIC 5** (Communications)| **P3 (Média)** | Depende do EPIC 3 para acionamento via eventos. |
| **EPIC 4** (Payments & Escrow)| **P3 (Média)** | Depende do EPIC 3. Requer integração bancária. |

---

## 4. Marcos de Entrega (Milestones)

### Milestone 1: Versão Alpha (Fundação e Descoberta)
**Foco:** Cadastro, Perfilação e Busca Simples (Contato Externo).
- **Conteúdo:** EPIC 1, EPIC 2 e EPIC 6 (Admin básico).
- **Entregável:** Banco de dados populado, autenticação funcional (Zero Vazamentos), listagens com busca performática e fluxo básico onde o contato ocorre externamente (WhatsApp).

### Milestone 2: Versão Beta (Marketplace Core e Intermediação)
**Foco:** Internalização da Negociação e Gestão de Propostas.
- **Conteúdo:** EPIC 3 e EPIC 5.
- **Entregável:** Solicitações de serviço; envio de propostas; Transição Atômica (aceite bloqueia as outras propostas); Notificações transacionais e comunicação internalizada.

### Milestone 3: Produção / V1.0 (Garantia Financeira e Go-Live)
**Foco:** Monetização Segura e Retenção Escrow.
- **Conteúdo:** EPIC 4 e consolidação do EPIC 6.
- **Entregável:** Pagamentos com Escrow, dashboards de Analytics, auditoria ativa e prevenção de vazamento de PII. Transações consistentes entre Banco Local e Gateways.
