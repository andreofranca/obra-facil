# Revisão das Regras de Negócio (Business Rules)

A auditoria nos fluxos de serviço (Solicitações, Propostas, Mensagens) revelou os seguintes comportamentos.

## Verificação de Autenticação / Autorização
- **Positivo**: A camada de API utiliza bem o `getAuthSession()` e valida papéis (ex: `session.role !== "CLIENT"`).
- **Positivo**: Filtros restritivos no Prisma (ex: `clienteId: session.clienteId`) previnem ataques IDOR em visualizações de listagem de solicitações (em `src/app/api/solicitacoes/route.ts`).

## Verificação de Fluxos
- **Estado de Orçamentos (Propostas)**: Profissionais criam orçamentos atrelados a uma `Solicitacao`. O cliente pode ter múltiplas propostas concorrendo pela mesma solicitação (Pendente, Aceita, Recusada).
- **Inconsistência de Chat**: A entidade `MensagemSolicitacao` não obriga validação de pertencimento no banco ao inserir. Se um usuário arbitrário conseguir acessar um ID de solicitação, ele hipoteticamente poderia inserir mensagens caso as rotas não façam verificação rigorosa de pertencimento (a ser validado nas implementações futuras).

## Transições de Status
- Atualmente, as transições da `SolicitarServico` (`ABERTA` -> `EM_ANDAMENTO` -> `CONCLUIDA`) carecem de um Controller ou State Machine restrito. Em um ambiente maduro, o sistema deve bloquear o envio de novas propostas caso a solicitação já esteja `CONCLUIDA`. A lógica de bloqueio ainda parece frágil nos route handlers.
