# Quality Guidelines

## Visão Geral
A qualidade no projeto ObraFácil não é responsabilidade exclusiva de um profissional (QA), mas sim uma cultura intrínseca a todo o time de engenharia. Este documento descreve as diretrizes fundamentais para garantir a confiabilidade do nosso sistema baseado em Next.js e Prisma.

## Princípios de Qualidade
1. **Prevenção > Detecção:** É preferível investir em testes automatizados e tipagem forte com TypeScript do que encontrar bugs em produção.
2. **Automação Contínua:** Todo processo de validação passível de automação deve ser integrado no CI/CD via Docker e pipelines estritos.
3. **Imutabilidade de Testes:** Testes não devem depender de ordem de execução ou de estado deixado por outro teste no PostgreSQL.
4. **Resiliência:** A aplicação deve tratar exceções de forma graciosa. Erros na comunicação com o banco não podem derrubar o servidor nem vazar o stack trace para o cliente.

## Tecnologias Homologadas
- **TypeScript:** Primeira barreira contra erros em tempo de compilação.
- **ESLint & Prettier:** Padronização sintática e prevenção de code smells.
- **Prisma Studio / Migrations:** Evolução previsível e consistente do banco de dados (PostgreSQL).
- **Testes:** Ferramentas para as camadas unitárias, de integração e ponta a ponta (E2E) que formam a nossa pirâmide.
