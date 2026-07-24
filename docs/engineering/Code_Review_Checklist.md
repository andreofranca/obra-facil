# Code Review Checklist

Este checklist visa assegurar a qualidade e a segurança do código que está prestes a ser mesclado ao ramo principal do projeto ObraFácil.

## Itens Obrigatórios para Revisão

### 1. Arquitetura
- [ ] O código segue a estrutura e padrões do projeto (Clean Architecture, SOLID)?
- [ ] Evita complexidade acidental e duplicação desnecessária (DRY, KISS)?
- [ ] A lógica de negócio está corretamente isolada de regras de apresentação?

### 2. Segurança
- [ ] As rotas e mutações validam se o usuário atual está autenticado e tem as permissões corretas (role-based)?
- [ ] Não há exposição acidental de dados confidenciais nos payloads das APIs ou logs?
- [ ] Dados de input recebidos (body, queries, params) são completamente validados/sanitizados antes de interagir com o DB?

### 3. Performance
- [ ] Ausência de chamadas "N+1" nas operações de banco de dados.
- [ ] Queries massivas usam limitadores mecânicos paginados e dependem de índices (`@@index`) apropriados?
- [ ] Redução de payloads e includes inúteis, usando Selects granulares?

### 4. Legibilidade
- [ ] Nomenclatura das variáveis e métodos é expressiva e autoexplicativa?
- [ ] Há comentários pontuais explicando o *porquê* de soluções não-óbvias (evitando comentar *o que* a linha faz de forma redundante)?

### 5. Testes
- [ ] O fluxo feliz foi testado? Os fluxos de exceção (casos extremos/limite) possuem cobertura de teste adequada?

### 6. Logging
- [ ] Blocos complexos `try/catch` registram os erros via Logger do sistema contendo contexto para debug?

### 7. Auditoria (Audit Trail)
- [ ] Ações críticas de negócio (como criação de propostas, alteração de status) possuem o registro adequado na trilha de auditoria?

### 8. Documentação
- [ ] A mudança exigiu atualização de algum modelo no `docs/engineering` ou num ADR (Architecture Decision Record)? Se sim, a documentação reflete o novo código?

### 9. Compatibilidade
- [ ] O contrato (Schema JSON) da API não foi quebrado para versões anteriores de Frontends consumindo esta rota?
