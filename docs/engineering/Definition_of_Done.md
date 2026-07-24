# Definition of Done (DoD)

Este documento define os critérios de qualidade para aceitar que uma tarefa, funcionalidade ou Sprint foi de fato concluída.

## Checklist Obrigatório (Quando uma Sprint/Tarefa está concluída)

- [ ] **Código Escrito:** A lógica foi implementada integralmente seguindo o escopo e o plano de implementação aproado. Sem exceções ou atalhos ("YAGNI").
- [ ] **Revisão de Código (Code Review):** O código passou por Code Review completo e as pontuações foram abordadas.
- [ ] **Clean Code e SOLID:** A implementação respeita as Engineering Guidelines e os princípios arquiteturais (DRY, KISS).
- [ ] **Validações Limpas:** Nenhum erro de linting (`npm run lint`), tipagem ou compilação (`npm run build`).
- [ ] **Performance Mantida:** Não há introdução de novas queries N+1, falhas na indexação ou hard limits arbitrários, exceto se discutidos e documentados em ADR.
- [ ] **Segurança Garantida:** Permissões, validações de payload e proteção contra injeções foram checadas.
- [ ] **Observabilidade:** Trilhas de auditoria (Audit) e logs de sistema (Logger) estão implementados para ações vitais e exceções.
- [ ] **Relatório Técnico (Se aplicável):** Foi gerado um relatório de saúde/arquitetura expondo as modificações e o impacto sistêmico das alterações.
- [ ] **Deployável:** O código está apto para ir a produção e não quebra compatibilidade com clientes existentes.
