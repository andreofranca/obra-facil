# Error Handling e Boundaries

A plataforma de observabilidade introduz uma hierarquia rigorosa para tratamento de exceções.
Nenhuma requisição deverá estourar "500 Internal Server Error" sem ser classificada e registrada pela plataforma.

## Classes de Domínio (BaseError)
- **BusinessError**: (HTTP 400) Regras de negócio violadas. (Ex: "Não é possível aceitar uma proposta já cancelada").
- **ValidationError**: (HTTP 400) Dados mal formatados enviados pelo cliente.
- **UnauthorizedError**: (HTTP 401/403) Falta de permissões ou token inválido.
- **InfrastructureError**: (HTTP 500) Banco de dados inatingível, serviço de email fora do ar, falha de cache. Aciona alertas críticos (High Severity).
- **UnexpectedError**: (HTTP 500) Erros não tratados (Null pointer, etc). Aciona paging e incidentes severos (Critical Severity).

## Uso
No backend (Next.js API Routes):
Use o middleware de HOC `withObservability(handler)`.
Ele captura silenciosamente qualquer exceção atirada na função interna e encapsula adequadamente enviando para o ILogger.

No Frontend (React App Router):
Componentes de página usam o `GlobalErrorBoundary` via arquivos `error.tsx` nativos do Next.js. O erro será atrelado ao `digest` para cruzar com logs de SSR.
