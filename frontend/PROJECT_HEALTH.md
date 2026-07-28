# Project Health

| Indicador | Status | Observação |
|-----------|--------|-------------|
| **Arquitetura** | Estável | Transição para a `Platform Layer` estabelecida com sucesso. |
| **Design System** | Em Crescimento | Base migrada, introdução forte em Skeletons e componentes de feedback (`EmptyState`). |
| **Platform Layer** | Consolidada (v1) | Notificações, Diálogos, Loading e Theme Providers funcionais. |
| **Componentes Reutilizáveis** | Alto | Uso extensivo do `BaseInput` e `Icon` wrapper. |
| **Formulários Migrados** | Parcial | Login, Cadastro, Service Wizard. Faltam propostas e perfis. |
| **Cobertura Unitária** | Inicial (QEF) | Cobertura nos *Helpers* e *Hooks* (Platform Layer). |
| **Cobertura de Componentes** | Inicial (QEF) | Validação render/a11y em botões e inputs (`src/components`). |
| **Cobertura de Integração** | A definir | Framework preparado (Vitest/RTL), mapeamento pendente nos fluxos complexos. |
| **Cobertura E2E** | Inicial (QEF) | Estrutura Playwright rodando com validação base de Acessibilidade via teclado. |
| **Status Acessibilidade (a11y)**| Automatizado | `jest-axe` ativo no CI para componentes. Foco e Contraste monitorados E2E. |
| **Status Performance** | Monitorado | Documentação ativa para LCP, CLS, INP (ADR-016). |
| **Status DevOps (CI/CD)** | Implantado (V1) | Workflows ativos via GitHub Actions (Quality Gate e Release). |
| **Políticas Comunitárias** | Implantadas | Code of Conduct, Contributing, Security e PR/Issue Templates vigentes. |
| **Dívida Técnica** | Moderada | Regras em Route Handlers; Adicionada a futura necessidade de Regressão Visual. |
| **Status Build** | Passando (OK) | O build Next.js foi consertado e passa limpo (turbopack). |
| **Status Lint** | Limpo | Dívidas técnicas zeradas (0 errors) durante a inicialização DevOps. |
| **Última Revisão** | DevOps (Epic 3.1) | Implantação da DevOps Foundation (Workflows e Templates). |
| **Próxima Sprint** | A Definir | Aguardando diretrizes de Core Business. |
