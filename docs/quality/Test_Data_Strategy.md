# Estratégia de Dados de Teste (Test Data Strategy)

A confiabilidade dos Testes de Integração e E2E repousa na qualidade e previsibilidade dos dados persistidos no PostgreSQL do ObraFácil.

## Princípios Básicos
- **Nunca utilize o banco de Produção ou Staging para testes automatizados CI.**
- Todo teste deve ser autossuficiente e capaz de preparar o próprio estado no banco (Arrange, Act, Assert).

## Abordagem com Docker & Prisma
Para garantir isolamento absoluto:
1. **Banco Efêmero:** O CI deve invocar `docker-compose up -d db_test` levantando um PostgreSQL isolado antes das suítes rodarem.
2. **Migrations Zeradas:** O pipeline deve rodar `npx prisma migrate reset --force` (ou `prisma db push` no CI) para garantir o Schema V2 puro.
3. **Seeding Dinâmico:** Ao invés de um dump de banco fixo (que fica defasado facilmente), os testes utilizam *Factories* automatizadas (via TypeScript e `faker-js`) que rodam no setup da suíte.

## Testes Isolados (Tear Down)
Para testes de Integração que compartilham um mesmo container:
- As tabelas não devem crescer descontroladamente. Recomenda-se utilizar as Transações Interativas do Prisma (`$transaction`) no modo *Rollback* em bibliotecas compatíveis, ou promover um truncamento/deleção limpo das tabelas a cada `afterEach()` na suíte (ex: `prisma.proposta.deleteMany()`).

## Gestão de Segredos de Teste
Senhas nos bancos efêmeros não têm relevância (ex: usar senhas estáticas '123456' hasheadas no seed de QA), mas tokens externos simulados para integração (Gateways, AWS S3 mock) devem ser injetados via `.env.test`.
