# Melhorias Sugeridas (Improvements)

Além dos bugs registrados em `defects.md`, a homologação identificou as seguintes necessidades arquiteturais para garantir a saúde a longo prazo da plataforma.

## 1. Abordagem Padronizada de Paginação
**Problema:** Listas como Busca de Profissionais, Listagem de Solicitações e Histórico não comportam volumes altos sem degradar CPU/Memória.
**Proposta:** Criar um utilitário universal de paginação em `src/lib/utils/pagination.ts` e aplicá-lo em todas as Collections do Prisma. Retornar um envelope padronizado para arrays:
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "lastPage": 15
  }
}
```

## 2. Refatoração de Permissões (Guards/Policies)
**Problema:** Atualmente as checagens `if (session.role !== "CLIENT")` são repetidas hardcoded nos roteadores de API.
**Proposta:** Adotar um padrão de Middlewares de Segurança para Route Handlers ou utilizar a recém-preparada camada de policies em `src/lib/auth/guards.ts` para isolar lógicas repetitivas.

## 3. Gestão de Estado da Solicitação (State Machine)
**Problema:** Hoje o Status de uma solicitação é um ENUM trocado arbitrariamente.
**Proposta:** Implementar uma máquina de estados no backend:
`ABERTA` não pode pular para `CONCLUIDA` sem passar por `EM_ANDAMENTO`.
Quando passada para `CONCLUIDA`, um observer (ou Event Listener) poderia automaticamente disparar uma notificação (In-App ou E-mail) chamando o cliente para inserir a `AvaliacaoServico`.
