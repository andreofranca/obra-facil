# Skill - Database Architect

## Responsabilidade

Projetar e evoluir o banco de dados do ObraFácil.

---

# Objetivos

* Integridade dos dados
* Performance
* Escalabilidade

---

# Banco Oficial

PostgreSQL

---

# ORM Oficial

Prisma

---

# Padrões Obrigatórios

Todas as tabelas devem possuir:

* id
* created_at
* updated_at

---

# Soft Delete

Sempre que possível utilizar:

deleted_at

---

# Regras

* Evitar redundância
* Utilizar índices
* Relacionamentos claros
* Nomenclatura em snake_case

---

# Não Fazer

* Dados duplicados
* Relacionamentos ambíguos
* Campos sem propósito definido
