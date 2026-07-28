# Security Foundation Architecture

A Security Foundation é a base transversal que governa a proteção dos recursos do ObraFácil. Ela foi desenhada em torno do padrão de Inversão de Controle, garantindo que as regras de negócio permaneçam puras.

## 1. Crypto Provider (`ICryptoProvider`)
O encapsulamento da criptografia permite testes unitários previsíveis e simplifica a troca de algoritmos. Atualmente, usa-se `scrypt` via Node.js, com a possibilidade de evolução para Argon2.

## 2. Session Provider (`ISessionProvider`)
Desacopla a assinatura de tokens. O sistema usa `SignedCookieSessionProvider` no momento. O payload e a assinatura via HMAC são opacos para a aplicação. Para uso no Edge, onde a criptografia pesada é restrita, utilizamos o `EdgeSessionDecoder` estritamente para heurística de roteamento.

## 3. Authorization Service (`IAuthorizationService`)
Migramos do acoplamento forte aos tipos de negócio (`AuthUserRole`, `clienteId`) para um modelo genérico (Principal, Action, Resource).
Isso permite um RBAC (Role-Based Access Control) ou ABAC (Attribute-Based Access Control) unificado, resolvendo permissões sem sujar a plataforma com jargões de negócio.

## 4. Audit Provider (`IAuditProvider`)
A interface estabelece o padrão de auditoria. Atualmente na versão `NoOpAuditProvider`, mas preparado estruturalmente para ingestão contínua em datalakes ou SIEMs de segurança no futuro.

## 5. Integração Middleware x Observability (`withAuth`)
O adaptador de API Routes captura o Principal extraído do domínio e autoriza a requisição. Em caso de bloqueio, a exceção `UnauthorizedError` intercepta o fluxo e delega a tratativa de log + status 401 à `Observability Capability`.
