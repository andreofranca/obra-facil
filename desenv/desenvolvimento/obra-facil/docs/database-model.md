# Modelo de Banco de Dados

## Objetivo

Definir a estrutura inicial do banco de dados do ObraFácil para suportar o MVP.

Banco escolhido:

* PostgreSQL
* Prisma ORM

---

# Entidades do MVP

## User

Representa qualquer usuário da plataforma.

### Campos

| Campo      | Tipo         | Observação                  |
| ---------- | ------------ | --------------------------- |
| id         | UUID         | PK                          |
| name       | VARCHAR(150) | Obrigatório                 |
| email      | VARCHAR(255) | Único                       |
| password   | VARCHAR(255) | Hash                        |
| role       | ENUM         | CLIENT, PROFESSIONAL, ADMIN |
| active     | BOOLEAN      | Default true                |
| created_at | TIMESTAMP    |                             |
| updated_at | TIMESTAMP    |                             |

---

## Professional

Dados específicos do profissional.

### Campos

| Campo         | Tipo         |
| ------------- | ------------ |
| id            | UUID         |
| user_id       | UUID         |
| description   | TEXT         |
| whatsapp      | VARCHAR(20)  |
| city          | VARCHAR(100) |
| state         | VARCHAR(2)   |
| premium       | BOOLEAN      |
| premium_until | TIMESTAMP    |
| created_at    | TIMESTAMP    |
| updated_at    | TIMESTAMP    |

---

## Category

Categorias de serviços.

### Exemplos

* Pedreiro
* Pintor
* Eletricista
* Encanador
* Jardineiro
* Marceneiro
* Gesseiro
* Ladrilhador
* Marido de Aluguel

### Campos

| Campo  | Tipo         |
| ------ | ------------ |
| id     | UUID         |
| name   | VARCHAR(100) |
| slug   | VARCHAR(100) |
| active | BOOLEAN      |

---

## ProfessionalCategory

Relacionamento N:N.

Um profissional pode atuar em várias categorias.

### Campos

| Campo           | Tipo |
| --------------- | ---- |
| id              | UUID |
| professional_id | UUID |
| category_id     | UUID |

---

## Portfolio

Fotos dos trabalhos realizados.

### Campos

| Campo           | Tipo         |
| --------------- | ------------ |
| id              | UUID         |
| professional_id | UUID         |
| image_url       | TEXT         |
| title           | VARCHAR(255) |
| created_at      | TIMESTAMP    |

---

## Subscription

Controle de planos.

### Campos

| Campo           | Tipo      |
| --------------- | --------- |
| id              | UUID      |
| professional_id | UUID      |
| plan            | ENUM      |
| start_date      | TIMESTAMP |
| end_date        | TIMESTAMP |
| status          | ENUM      |

---

# Relacionamentos

User

1 → 1 Professional

---

Professional

1 → N Portfolio

---

Professional

N → N Category

através de ProfessionalCategory

---

Professional

1 → N Subscription

---

# Índices

## User

* email

---

## Professional

* city
* premium

---

## Category

* slug

---

# Soft Delete

Todas as entidades principais deverão possuir:

```text
deleted_at
```

para exclusão lógica.

---

# Auditoria

Todas as tabelas devem possuir:

```text
created_at
updated_at
```

---

# Versão MVP

Entidades previstas:

* User
* Professional
* Category
* ProfessionalCategory
* Portfolio
* Subscription

Total: 6 entidades.
