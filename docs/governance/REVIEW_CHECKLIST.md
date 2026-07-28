# Review Checklist

Para que uma entrega seja considerada pronta (Definition of Done), o engenheiro deve validar afirmativamente todos os pontos abaixo:

- [ ] **Arquitetura:** O código respeita os limites de contexto e não fura o isolamento da Plataforma?
- [ ] **Segurança:** Dados sensíveis (PII, tokens, senhas) não vazam para logs, payloads públicos ou métricas?
- [ ] **Testes:** A cobertura de testes foi mantida ou expandida?
- [ ] **Quality Gate:** O Lint, o Build (Turbopack) e os Testes executaram com sucesso? Nenhuma rule de Typescript/Eslint ignorada por desleixo?
- [ ] **Observabilidade:** Há `ILogger` instrumentando caminhos críticos de sucesso e falha com uso adequado do `correlationId`?
- [ ] **Documentação:** O Technical Radar, Debt Register, e ADRs (se houver decisões estruturais) foram atualizados?
- [ ] **Governance:** O Relatório Final (Governance Review) contendo os pareceres e scorecard (0-10) foi preenchido?
