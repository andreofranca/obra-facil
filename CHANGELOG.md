# Changelog

---

## v0.8.4 — Sprint 09.1

### Adicionado

- Centralização da autenticação em camada reutilizável.
- Criação da camada de sessão para parsing e criação de cookies assinados.
- Criação dos guards de autenticação e autorização por perfil.
- Integração dos guards às rotas protegidas do marketplace.

### Alterado

- Mantida a compatibilidade do fluxo existente por meio da camada `auth.ts`.
- Reorganização da lógica de sessão para reduzir duplicação e facilitar a evolução futura.

### Validação

- Execução bem-sucedida de `npm run lint` e `npm run build` após a integração.

---

## v0.8.3

### Adicionado

- Início de serviço pelo profissional contratado
- Botão "Iniciar Serviço" com estado de carregamento
- US001 concluída

### Alterado

- Endpoint PATCH /api/solicitacoes/[id] para atualizar `status` e `startedAt`
- Uso de `prisma.$transaction` no backend para atualização de status de solicitação

### Melhorias

- Interface atualiza automaticamente após início do serviço
- Validação de profissional contratado para iniciar serviço

---

## v0.8.2

### Adicionado

- Aceite de propostas
- Recusa de propostas
- API PATCH /api/propostas/[id]
- Componente PropostaItem

### Alterado

- Fluxo de contratação
- Atualização automática do status da solicitação
- Atualização automática das propostas

### Melhorias

- Uso de prisma.$transaction
- Melhorias na autorização
- Melhorias de UX
