# Business Rules

## Objetivo

Centralizar todas as regras de negócio do MVP.

---

# BR001

Todo profissional deve possuir uma conta de usuário válida.

---

# BR002

Um usuário pode possuir apenas um perfil profissional.

---

# BR003

Um profissional pode atuar em múltiplas categorias.

Exemplo:

* Eletricista
* Marido de Aluguel

---

# BR004

Um profissional deve informar obrigatoriamente:

* Nome
* Cidade
* WhatsApp
* Pelo menos uma categoria

---

# BR005

O contato entre cliente e profissional ocorre exclusivamente via WhatsApp no MVP.

---

# BR006

O ObraFácil não participa da negociação.

Não realiza:

* Cobrança
* Contratação
* Pagamento

---

# BR007

Profissionais Premium possuem prioridade na ordenação dos resultados.

---

# BR008

Perfis inativos não devem aparecer nas buscas.

---

# BR009

Categorias inativas não podem ser selecionadas.

---

# BR010

Apenas administradores podem:

* Criar categorias
* Editar categorias
* Inativar categorias

---

# BR011

O portfólio deve aceitar apenas:

* JPG
* PNG
* WEBP

---

# BR012

Clientes não podem editar perfis profissionais.

---

# BR013

E-mails devem ser únicos no sistema.

---

# BR014

Exclusões serão realizadas através de Soft Delete.

---

# BR015

Todas as ações críticas devem ser registradas em log.

Exemplos:

* Login
* Cadastro
* Atualização de perfil
* Inativação
