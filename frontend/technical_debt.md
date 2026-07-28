# Dívida Técnica (Technical Debt)

Este documento registra débitos técnicos conhecidos, *trade-offs* assumidos por questões de tempo e débitos arquiteturais que precisam ser solucionados em Sprints futuras para manter a saúde do projeto a longo prazo.

## Dívidas Registradas

### 1. Testes de Regressão Visual (Visual Regression Testing)
**Adicionado em**: v0.24.0-beta (Sprint QEF)
**Contexto**: Construímos a fundação de testes unitários, componentes e E2E via Vitest e Playwright. No entanto, garantir que componentes visuais (como o `Button`, Skeletons, ou Modais) não percam paddings, cores ou sofram quebras de layout não está automatizado.
**Estratégia Futura**: Na Sprint de *Design System Automations*, integraremos **Playwright Visual Comparisons** ou **Percy/Chromatic**. Precisaremos configurar snapshots controlados rodando em contêineres Docker (para evitar falsos positivos de *font-rendering* entre Linux CI e Windows local).
