# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning (loosely on beta).

## [Unreleased] - (Trabalho Atual)

### Adicionado (Epic 3.1 DevOps Foundation)
- **CI/CD**: Workflows em GitHub Actions para `ci.yml`, `quality-gate.yml` e um placeholder `release.yml`.
- **Comunidade**: Adicionados os arquivos `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- **Templates**: `bug.yml`, `feature.yml`, `question.yml` e `PULL_REQUEST_TEMPLATE.md` padronizados para escalar o controle de contribuições.
- **Documentação Ops**: Novas diretrizes para CI/CD (`ci-cd.md`), estratégias de branch (`branching.md`) e processo de lançamento (`release-process.md`).

## [0.23.0-beta] - 2026-07-28
### Added
- **Platform Layer** (EPIC 1):
  - Sistema global de Notificações (`NotificationProvider`, `useToast`, `Toast.tsx`).
  - Sistema global de Diálogos imperativos (`DialogProvider`, `useDialog`, `GlobalDialog.tsx`).
  - Sistema de Contexto para Temas (`ThemeProvider`, tokens de cores adaptados do Tailwind).
- Componentes de **Feedback e UX** reutilizáveis:
  - `<ButtonLoading>`, `<PageLoading>`, `<LoadingOverlay>`.
  - Skeletons variados (`CardSkeleton`, `ListSkeleton`, `ProfileSkeleton`, `FormSkeleton`, `DashboardSkeleton`).
  - `<EmptyState>` reutilizável.
- **Icon Wrapper**:
  - `Icon.tsx` em `src/platform/icons` isolando a dependência do `lucide-react` da aplicação principal.
- Documentação formal e padrões:
  - `docs/ENGINEERING_STANDARDS.md` e múltiplos ADRs (`008` ao `012`).
  - `PLATFORM_GUIDE.md` instruindo o uso da nova arquitetura.
  - `PROJECT_HEALTH.md`.

### Changed
- Refinamento da estrutura de diretórios para segregação de infraestrutura em `src/platform/` versus UI Visual em `src/components/feedback/`.

### Fixed
- Correção global de Acessibilidade nos novos modais (`aria-modal`, `tabIndex`, suporte a tecla Escape) e toasts (`aria-live="polite"`).

### Technical
- Quality Gate executado limpo na camada refatorada. 
- Padronização total de importações de ícones projetada para próximas sprints.
