# PROJECT STATUS

## Concluído

### Solicitação de Serviço

- Página `/solicitar-servico` criada com formulário em Tailwind CSS.
- API `POST /api/solicitacoes` criada para cadastrar solicitações.
- Página de detalhe do profissional atualizada com botão "Solicitar Serviço".
- Validação tipada de payload adicionada sem uso de `any`.
- Fluxo validado com `npm run lint` e `npm run build`.

### Área do Cliente

- Página `/meus-pedidos` criada para listar solicitações do cliente.
- API `GET /api/solicitacoes?clienteId=UUID` criada para buscar solicitações por cliente.
- Home atualizada com link para `/meus-pedidos`.
- Badges visuais adicionadas para os status de solicitação.
- Fluxo validado com `npm run lint` e `npm run build`.

### Autenticação MVP

- Páginas `/login` e `/cadastro` criadas.
- APIs `POST /api/auth/login` e `POST /api/auth/register` criadas.
- Senhas armazenadas com hash usando `crypto.scrypt`.
- Sessão simples criada com cookie HTTP-only assinado.
- Página `/meus-pedidos` atualizada para usar o `clienteId` da sessão.
- Fluxo validado com `npm run lint` e `npm run build`.

### Painel do Profissional MVP

- Página `/profissional/pedidos` criada com dashboard de solicitações.
- API `GET /api/profissional/solicitacoes` criada para listar solicitações compatíveis com os serviços do profissional autenticado.
- API `PATCH /api/solicitacoes/[id]` criada para atualização de status.
- Ações "Em análise", "Aceitar", "Iniciar" e "Concluir" adicionadas.
- Sessão de autenticação atualizada para carregar `profissionalId`.
- Fluxo validado com `npm run lint` e `npm run build`.

### Sprint 06.1 — Ajuste Estrutural do Marketplace

- Relação Prisma `SolicitarServico` ↔ `Profissional` adicionada via `profissionalId`.
- Página `/profissionais/[id]` atualizada para abrir `/solicitar-servico` com o profissional selecionado.
- API `POST /api/solicitacoes` atualizada para validar e salvar `profissionalId`.
- API `GET /api/profissional/solicitacoes` atualizada para filtrar por `profissionalId`, removendo o filtro textual.
- API `GET /api/solicitacoes?clienteId=UUID` atualizada para retornar o profissional vinculado.
- Fluxo validado com `npm run lint` e `npm run build`.

### Sprint 07 — Chat Cliente ↔ Profissional

- API `GET /api/solicitacoes/[id]/mensagens` criada para listar mensagens da solicitação em ordem cronológica.
- API `POST /api/solicitacoes/[id]/mensagens` criada para gravar mensagens na tabela `service_request_messages`.
- Página `/minhas-solicitacoes/[id]` criada para o cliente visualizar a solicitação e conversar com o profissional.
- Página `/profissional/pedidos/[id]` criada para o profissional visualizar o pedido e responder mensagens.
- Componentes `ChatMensagens`, `ChatMensagem` e `ChatFormulario` criados em `components/chat`.
- Tipagens compartilhadas de chat criadas em `frontend/src/types/chat.ts`.

### Sprint 08.1 — Sistema de Propostas

- Model Prisma `Proposta` criado com status, valor, prazo, mensagem e vínculos com solicitação e profissional.
- Enum Prisma `PropostaStatus` criado com `PENDENTE`, `ACEITA` e `RECUSADA`.
- API `POST /api/propostas` criada para profissionais enviarem propostas.
- API `GET /api/propostas` criada para listar propostas com filtros por cliente, profissional e solicitação.
- Formulário "Enviar Proposta" adicionado em `/profissional/pedidos/[id]`.
- Página `/minhas-propostas` criada para clientes acompanharem propostas recebidas.
- Tipagens compartilhadas de propostas criadas em `frontend/src/types/proposta.ts`.

## Banco de Dados

As solicitações continuam usando a tabela `service_requests`, mapeada pelo model `SolicitarServico`.
A migration `20260618120000_add_profissional_to_service_requests` adiciona `profissionalId`, índice e foreign key opcional para `professionals(id)`.
A migration `20260618130000_add_author_to_service_request_messages` adiciona `usuarioId`, índice e foreign key opcional para `users(id)` na tabela `service_request_messages`.
A migration `20260618140000_create_proposals` cria a tabela `proposals`, o enum `PropostaStatus`, índices e foreign keys para `service_requests` e `professionals`.
O cadastro cria registros em `users` e `clients`, usando o model `User` existente e a relação `Cliente`.

## Observações

Solicitações antigas podem permanecer sem `profissionalId`; novas solicitações criadas pela API exigem o vínculo com um profissional.

# CHECKPOINT — Sprint 06

Data: 16/06/2026

## Concluído

### Sprint 01

* Infraestrutura Next.js
* Prisma
* PostgreSQL

### Sprint 02

* Categorias
* API de categorias

### Sprint 03

* Profissionais
* API de profissionais
* Filtro por categoria

### Sprint 04

* Solicitação de serviços
* Área do cliente
* Listagem de pedidos

### Sprint 05

* Cadastro
* Login
* Sessão por cookie
* Hash de senha

### Sprint 06

* Painel do profissional
* Dashboard de solicitações
* Atualização de status
* API do profissional
* Gestão de pedidos

## Pendente

### Sprint 06.1

* Concluído em 18/06/2026: SolicitarServico ↔ Profissional relacionado no Prisma
* Concluído em 18/06/2026: migration criada
* Concluído em 18/06/2026: filtro textual removido

### Sprint 07

* Concluído em 18/06/2026: APIs de mensagens
* Concluído em 18/06/2026: páginas de detalhe do cliente e profissional
* Concluído em 18/06/2026: componentes reutilizáveis de chat

### Sprint 08.1

* Concluído em 18/06/2026: model e migration de propostas
* Concluído em 18/06/2026: APIs de criação e listagem de propostas
* Concluído em 18/06/2026: envio pelo painel profissional
* Concluído em 18/06/2026: listagem do cliente em `/minhas-propostas`

### Sprint 08

* Orçamento e aceite de proposta
