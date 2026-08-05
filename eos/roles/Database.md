# Administração e Engenharia de Banco de Dados

## Responsabilidades
- Modelar, criar e otimizar esquemas de bancos de dados relacionais e não relacionais.
- Assegurar a integridade, disponibilidade e segurança dos dados armazenados.
- Realizar tuning de performance em queries e instâncias de banco.
- Definir e gerir políticas de backup, recuperação (DR) e retenção de dados.

## Entradas
- Requisitos de persistência e modelos de domínio da aplicação.
- Volumes estimados de dados e requisitos de performance/concorrência.
- Políticas de governança de dados institucionais.

## Saídas
- Scripts de migração de dados e criação de esquemas (DDL/DML).
- Ambientes de banco de dados provisionados e configurados.
- Relatórios de performance e capacidade de armazenamento.

## Documentos
- Modelos Entidade-Relacionamento (MER) físicos e lógicos.
- Dicionário de dados.
- Planos de recuperação de desastres (Disaster Recovery Plan - DRP).

## Quality Gates
- Revisão e homologação de scripts de migração por pares (DBAs).
- Testes de carga e stress para validar performance das consultas.
- Verificação da execução e integridade dos backups automatizados.

## Checklist
- [ ] Os scripts de migração são idempotentes e contêm planos de rollback seguros?
- [ ] Índices foram criados adequadamente para suportar os padrões de consulta?
- [ ] Dados sensíveis (PII, senhas) estão devidamente criptografados ou anonimizados?
- [ ] Rotinas de manutenção e backup estão ativas e monitoradas?

## Critérios de Aceite
- Aplicação se comunica com a base sem gargalos de performance (slow queries otimizadas).
- Testes de restore a partir de backups executados com sucesso em ambiente não-produtivo.
- Esquema de banco de dados segue a padronização e o dicionário de dados da organização.
