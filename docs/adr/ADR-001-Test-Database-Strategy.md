# ADR 001: Test Database and Integration Testing Strategy

## Status
Aprovado / Aceito

## Context
O projeto ObraFácil exige um nível elevado de confiabilidade com pipelines automatizados de CI/CD para assegurar não-regressão. O time precisa de um meio previsível, escalável e de rápido feedback loop para testar a comunicação entre a API Next.js e o PostgreSQL sem corromper os dados de desenvolvimento e suportar centenas de execuções concorrentes ou iterativas.

## Decision
Para os Testes de Integração, adotamos o seguinte modelo de trabalho restrito:

1. **Database Mutável Efêmera (Push):** Utilizaremos `prisma db push` nas execuções das suítes de teste ao invés de `migrate deploy`. O ganho de velocidade ao não validar passos SQL suprime a pequena desvantagem de não validar o pipeline histórico de produção em tempo de execução dos testes.
2. **Isolamento via TRUNCATE CASCADE:** A estratégia de isolamento entre testes (`between-test isolation`) será por limpeza direta nas tabelas, executando `TRUNCATE TABLE [names] RESTART IDENTITY CASCADE`, ao invés de embutir todo o fluxo de teste dentro de uma Rollback Transaction gigantesca, o que corriqueiramente induz deadlocks no Prisma, falseando os relatórios.
3. **Docker tmpfs para Performance:** As suítes de integração, locais e remotas (CI), consumirão as sessões de PostgreSQL criadas a partir de um arquivo autônomo e focado `docker-compose.test.yml`, desenhado para montar os dados no RAM (`tmpfs`), abandonando o desgaste e latência do I/O de disco para suítes inteiramente descartáveis.
4. **Integração Segmentada:** Unit tests e Integration Tests rodam em jobs separados dentro da CI. Integração requer alocação de infraestrutura, Unit não.

## Consequences
- **Positivas:** Redução substancial do tempo de I/O das Sprints da pipeline; blindagem hermética; impossibilidade lógica do Dev corromper acidentalmente os volumes de Dev/Staging executando o test runner sem querer.
- **Negativas:** Exige o empenho de manutenção de um arquivo auxiliar (`docker-compose.test.yml`) sempre que modificarmos versões dos SGDBs nativos. As migrations originais (`.sql`) só atestarão suas funcionalidades integrais no momento do *Build Step*, não do *Test Step*.
