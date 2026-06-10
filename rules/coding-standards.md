# Coding Standards

## Objetivo

Garantir consistência, legibilidade e manutenção do código do projeto ObraFácil.

---

# Princípios

## Clean Code

Todo código deve ser:

* Simples
* Legível
* Reutilizável
* Testável

---

## SOLID

Aplicar sempre que possível:

* Single Responsibility
* Open/Closed
* Liskov Substitution
* Interface Segregation
* Dependency Inversion

---

## DRY

Don't Repeat Yourself.

Evitar duplicação de lógica.

---

## KISS

Keep It Simple.

Priorizar soluções simples.

---

# TypeScript

Obrigatório:

* strict mode
* tipagem explícita quando necessário
* evitar any

---

# Componentes

Cada componente deve possuir responsabilidade única.

Evitar componentes com mais de 300 linhas.

---

# APIs

Todas as APIs devem:

* Validar entrada
* Tratar erros
* Retornar padrão consistente

---

# Banco de Dados

Nunca acessar Prisma diretamente pela camada de UI.

Fluxo obrigatório:

Controller → Service → Repository → Prisma

---

# Comentários

Comentar apenas quando necessário.

Código deve ser autoexplicativo.
