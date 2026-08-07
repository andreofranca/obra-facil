# Changelog

---

## EOS-FW-035 - Construção do Kernel (05/08/2026)

### Adicionado
- **Kernel do EOS**: Máquina de estados, ciclo de vida formal, e motor de execução documentados e incorporados à raiz da metodologia.
- **Governança**: Matriz formal de responsabilidades, workflow de engenharia e diretório de conhecimento.
- **Baseline 1.0.0**: Institucionalização do Framework com regras rígidas de procedimentalização da engenharia (Preparação para Automação).

---

## EOS-FW-034 - Institucionalização do EOS (05/08/2026)

### Adicionado
- Pastas estruturais `/eos`, `/eos/roles`, `/eos/templates`, `/eos/quality`, `/eos/skills`.
- Convenção de nomenclatura segregada: `EOS-FW` para metodologia e `OF` para produto.

---

## v0.13.0-beta - Product Certification Sprint I (05/08/2026)

### Adicionado
- Conversão total de Dashboards para Operação Real (sem mocks).
- Favoritos e Marketplace com integração total ao Prisma e Server Actions.
- Quality Gates atestados com 82 testes unitários.

---

## v0.8.4 - Sprint 09.1

### Adicionado
- Centralização da autenticação em camada reutilizável.
- Integração de rotas protegidas.

## [Unreleased] - 2026-08-07
### Added
- Application Shell com layout global (Sidebar Persistente, Header de Pesquisa, Contexto de Usuário dinâmico).
- Tratamento de nome ausente ou saudação vazia no componente de User Context ("Olá, {Nome}").
- Navegação padronizada baseada em Breadcrumbs, eliminando dependência do botão voltar do navegador.
- Unificação do Tema Escuro (Dark Mode) e Glassmorphism em todo o ambiente autenticado.
- Dashboard do Profissional reprojetado como um Painel Operacional funcional e reativo.
- Marketplace e Perfil do Profissional remodelados para estética premium e melhor visualização de portfólio.
- Tratamento de botões não-funcionais (marcados explicitamente como "Em Desenvolvimento").

### Fixed
- Middleware file correctly renamed to 'middleware.ts'.
- EdgeSessionDecoder refactored to support Edge runtime without node:crypto.
- Session API '/api/auth/session' created to hydrate client layouts.
- Redirect logic fixed for Professional logins.
- Rate Limiting mitigado no ambiente de testes (E2E) paralelizado, corrigindo os 429 Too Many Requests.

## [0.4.3] - 2026-08-07
### Changed
- Refatoração profunda para consolidar a UX das rotas autenticadas sob o \ApplicationShell\.
- Marketplace (e outras telas) portado para a identidade visual do Tailwind (Dark Theme, Backdrop Blur) do \meus-pedidos\.
- Remoção de textos provisórios (\Olá Cliente\, \Em Breve\, etc.).
- Sidebar global responsiva e unificada.
### Removed
- Antigos componentes e layouts aninhados que causavam problemas de UX e Headers duplos.
