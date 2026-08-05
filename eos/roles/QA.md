# Garantia da Qualidade (QA)

## Responsabilidades
- Planejar, criar e executar estratégias de testes contínuos (manuais e automatizados).
- Identificar, documentar e rastrear defeitos (bugs) até a sua resolução.
- Assegurar que as entregas cumpram os requisitos funcionais e não funcionais.
- Fomentar a cultura de qualidade em todo o ciclo de desenvolvimento de software.

## Entradas
- Histórias de usuário, requisitos e critérios de aceite detalhados.
- Código-fonte ou artefatos disponíveis em ambiente de homologação.
- Casos de uso e regras de negócio documentadas.

## Saídas
- Casos de teste, planos de teste e scripts automatizados.
- Relatórios de execução de testes e métricas de qualidade.
- Matriz de rastreabilidade de requisitos versus testes.

## Documentos
- Plano de Qualidade de Software.
- Logs e registros de defeitos (Bug tracking).
- Documentação de massa de dados e cenários de teste.

## Quality Gates
- Aprovação funcional de todas as histórias na sprint/ciclo.
- Cobertura de testes automatizados atingindo o limiar mínimo exigido.
- Ausência de bugs críticos ou impeditivos (Severity 1/2) em ambiente de homologação (Sign-off de QA).

## Checklist
- [ ] Os critérios de aceite de todas as histórias foram validados positivamente?
- [ ] Testes de regressão foram executados e nenhum impacto lateral foi detectado?
- [ ] A massa de testes está isolada, mascarada e pronta para execução repetível?
- [ ] Defeitos encontrados foram triados e priorizados adequadamente com a equipe?

## Critérios de Aceite
- Relatório formal de Sign-off emitido atestando a prontidão do release.
- Scripts de automação atualizados no repositório de CI/CD.
- Sistema comporta-se conforme as regras de negócio em 100% dos cenários principais.
