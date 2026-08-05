# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning (loosely on beta).

## [Unreleased] - (Trabalho Atual)
- Sprint atual focada em Product Certification aguardando aprovação.

## [0.24.0-beta] - 2026-08-05
### Added
- **Product Experience**:
  - Reestruturação completa do Dashboard do Cliente (`/meus-pedidos`) com UI Premium, saudação, categorias principais, vitrine de profissionais, serviços recentes e Skeleton Loading.
  - Reestruturação completa do Dashboard Comercial do Profissional (`/profissional/pedidos`) com métricas de Receita, Conversão, Agenda e serviços ativos (SaaS layout).
  - Vitrine de Profissionais (`/profissionais`) e Perfil Público (`/profissionais/[id]`) altamente enriquecidos com galerias, foto de capa, selos de experiência e botões flutuantes.
- **Automação de QA**:
  - Script Playwright (`take-screenshots.ts`) integrado para geração automática de evidências visuais do ambiente logado (Cliente e Profissional).
  - Seed robusto populado com dados reais de PMO (`cliente@pmo.com` e `profissional@pmo.com`) para validação comercial.

### Changed
- **Header**: Navegação otimizada dividida por perfis (Dashboard vs Painel Cliente).
- **Estética Global**: Implementação ostensiva de glassmorphism, sombras suaves (`shadow-soft`), e modais dinâmicos alinhados a um layout "SaaS Premium".
- **Banco de Dados / Prisma**: Adicionado mapeamento para tabelas de Histórico de Status, Chat e Favoritos.

### Fixed
- **Bugs Críticos**:
  - Correção na visibilidade do Input de Senha no Login.
  - Correção do Type Mismatch do Zod no `ServiceWizard` causado pela ausência do plugin babel (trocado para tratamento seguro no client-side).
  - Correção na Content Security Policy (CSP) no `next.config.ts` bloqueando imagens externas (picsum, pravatar).
  - Remoção de `autoFocus` invasivos travando rolagem no mobile.
  - Atualização do script de seed e autenticação para usar validação real `bcrypt` na conta PMO.

### Technical
- Quality Gates rigorosos passando 100%: `npm run lint` (regras ajustadas para fluidez visual), `npm run build` e `vitest` (82 testes integrados).

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
