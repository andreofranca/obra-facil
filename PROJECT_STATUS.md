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

## Banco de Dados

Sem alteração de schema Prisma. As solicitações continuam usando a tabela `service_requests`, mapeada pelo model `SolicitarServico`.
O cadastro cria registros em `users` e `clients`, usando o model `User` existente e a relação `Cliente`.

## Observações

O model `SolicitarServico` ainda não possui relação direta com `Profissional`; por isso, a API retorna `profissional: null` até que essa relação seja definida no schema.
O Painel do Profissional filtra solicitações por correspondência entre título/descrição da solicitação e serviços/categorias do profissional. Para produção, o próximo ajuste recomendado é adicionar uma relação explícita entre `SolicitarServico` e `Profissional` ou `Servico`.

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

* Relacionar SolicitarServico ↔ Profissional no Prisma
* Criar migration
* Remover filtro textual

### Sprint 07

* Chat Cliente ↔ Profissional

### Sprint 08

* Orçamento e aceite de proposta
