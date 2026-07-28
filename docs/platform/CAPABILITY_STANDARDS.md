# Capability Standards

Para garantir que a plataforma evolua com alta coesão e baixo acoplamento, todas as futuras Capabilities devem obedecer ao seguinte padrão arquitetural de implementação:

## 1. Estrutura de Diretórios
Todas as Capabilities devem residir isoladas dentro de `src/platform/<capability-name>`.
Nenhuma regra de negócio (domínio) deve vazar para dentro de `src/platform`.

## 2. Contratos antes da Implementação (Dependency Inversion)
Toda Capability deve exportar **interfaces**. O uso direto de classes ou bibliotecas de terceiros (como bibliotecas de log, SDKs da AWS, clientes de cache) deve ser encapsulado. A aplicação consome apenas o contrato.
Exemplo: Expor `ILogger` em vez de exportar uma dependência direta para o `Pino`.

## 3. Padrão de Exportação e Retrocompatibilidade
Toda Capability deve ter um arquivo `index.ts` que atua como barreira pública (Facade). Apenas os recursos explicitamente exportados por este arquivo devem ser consumidos pelo restante do sistema.

## 4. Injeção de Contexto Restrita (Edge vs Server vs Browser)
Devido às restrições dos runtimes do Next.js (Edge, Server, Client), Capabilities sistêmicas que dependem de recursos nativos (ex: `node:async_hooks`) não devem ser injetadas de forma hardcoded em módulos compartilhados. O design deve priorizar a Injeção de Dependências (IoC) e Providers.

## 5. Falha Segura (Fail-Safe)
Uma falha na Capability sistêmica não deve travar a regra de negócio da aplicação, exceto em casos restritos de segurança. Se o coletor de métricas falhar ou estiver fora do ar, o fluxo de usuário deve continuar. Use *Graceful Degradation* e blocos de `try/catch` internamente.
