# API Contract

## Objetivo

Definir os endpoints oficiais do MVP do ObraFácil.

---

# Padrão

Base URL:

```text
/api/v1
```

Formato de resposta:

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

Formato de erro:

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

---

# Autenticação

## POST /auth/register

Cadastro de usuário.

### Request

```json
{
  "name": "André França",
  "email": "andre@email.com",
  "password": "123456",
  "role": "PROFESSIONAL"
}
```

### Response

```json
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

---

## POST /auth/login

Login do usuário.

### Request

```json
{
  "email": "andre@email.com",
  "password": "123456"
}
```

---

## POST /auth/logout

Encerrar sessão.

---

# Usuários

## GET /users/me

Retorna usuário autenticado.

---

## PUT /users/me

Atualiza perfil.

---

# Profissionais

## GET /professionals

Lista profissionais.

### Filtros

```text
?category=eletricista
&city=sao-paulo
```

---

## GET /professionals/:id

Detalhes do profissional.

---

## POST /professionals

Criar perfil profissional.

---

## PUT /professionals/:id

Atualizar perfil profissional.

---

## DELETE /professionals/:id

Inativar perfil.

---

# Categorias

## GET /categories

Listar categorias.

---

## POST /categories

Criar categoria.

Admin apenas.

---

## PUT /categories/:id

Editar categoria.

Admin apenas.

---

# Portfólio

## GET /professionals/:id/portfolio

Listar imagens.

---

## POST /professionals/:id/portfolio

Adicionar imagem.

---

## DELETE /portfolio/:id

Remover imagem.

---

# Assinaturas

## GET /subscriptions

Listar assinaturas.

---

## POST /subscriptions

Criar assinatura.

(Versão futura)

---

# Administração

## GET /admin/users

Listar usuários.

---

## GET /admin/professionals

Listar profissionais.

---

## PATCH /admin/users/:id/status

Ativar/Inativar usuário.

---

# Versionamento

Todas as APIs devem utilizar:

```text
/api/v1
```

Mudanças incompatíveis:

```text
/api/v2
```
