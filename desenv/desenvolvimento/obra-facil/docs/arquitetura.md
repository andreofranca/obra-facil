# Arquitetura do Sistema

## Visão Geral

O ObraFácil será desenvolvido utilizando arquitetura monolítica modular, priorizando velocidade de desenvolvimento, simplicidade operacional e escalabilidade gradual.

A arquitetura foi projetada para suportar o MVP e evoluir posteriormente para microsserviços caso necessário.

---

# Stack Tecnológica

## Frontend

* Next.js 15
* React 19
* TypeScript
* TailwindCSS
* shadcn/ui

---

## Backend

* Next.js API Routes
* TypeScript

---

## Banco de Dados

* PostgreSQL

---

## ORM

* Prisma

---

## Autenticação

* Auth.js

---

## Upload de Imagens

* Cloudinary

---

## Hospedagem

### Frontend + Backend

Vercel

### Banco

Neon PostgreSQL

### Imagens

Cloudinary

---

# Arquitetura Geral

```text
Cliente
    │
    ▼
Frontend (Next.js)
    │
    ▼
API Routes
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
```

---

# Estrutura do Frontend

```text
frontend/

src/
│
├── app
├── components
├── features
├── hooks
├── lib
├── services
├── types
├── utils
└── styles
```

---

# Estrutura dos Componentes

```text
components/

ui/
layout/
forms/
cards/
modals/
tables/
```

---

# Estrutura das Features

```text
features/

auth/
professionals/
categories/
users/
admin/
subscriptions/
```

---

# Estrutura do Backend

```text
backend/

src/

api/
services/
repositories/
validators/
middlewares/
```

---

# Camadas

## API

Responsável por:

* Receber requisições
* Validar dados
* Chamar serviços

---

## Services

Responsável por:

* Regras de negócio

---

## Repositories

Responsável por:

* Acesso ao banco

---

## Validators

Responsável por:

* Validação de entrada

---

# Segurança

## Autenticação

JWT via Auth.js

---

## Senhas

Hash BCrypt

---

## Proteções

* Rate Limit
* CSRF
* XSS
* SQL Injection

---

# Uploads

Todas as imagens serão armazenadas no Cloudinary.

Tipos permitidos:

* JPG
* PNG
* WEBP

---

# Logs

Registrar:

* Login
* Cadastro
* Atualização de perfil
* Exclusão lógica

---

# Escalabilidade

MVP:

Monólito Modular

Futuro:

* API dedicada
* Aplicativo Mobile
* Microsserviços

---

# Padrões

## Código

* Clean Code
* SOLID
* DRY
* KISS

---

## Convenções

* TypeScript Strict Mode
* ESLint
* Prettier

---

# Objetivo da Arquitetura

Permitir crescimento rápido do produto sem gerar complexidade desnecessária durante o MVP.
