# Padrões de Engenharia - ObraFácil

Este documento define os alicerces arquiteturais e de qualidade de software exigidos para todo o código da plataforma ObraFácil.

## 1. Objetivos do Projeto
Prover uma plataforma robusta, segura e acessível para conexão entre clientes e profissionais de obras, assegurando um código limpo e escalável para suportar novas funcionalidades sem deterioração arquitetural.

## 2. Princípios Arquiteturais
- **Clean Architecture**: Regras de negócio devem ser isoladas da camada de apresentação e persistência.
- **SOLID**: Classes e funções devem ter responsabilidade única, estar abertas para extensão mas fechadas para modificação.
- **DRY (Don't Repeat Yourself)**: Evitar código duplicado (CSS, funções de validação, mapeamentos lógicos).
- **KISS (Keep It Simple, Stupid)**: Preferir clareza a "abstrações mágicas".

## 3. Estrutura de Pastas (Frontend)
- `src/app`: Páginas baseadas no App Router do Next.js.
- `src/components`: Componentes puros de UI, categorizados em `ui` (atômicos), `form`, `feedback`, `layout`.
- `src/platform`: Serviços transversais globais (Theme, Notifications, Dialogs, Icons wrapper).
- `src/lib`: Bibliotecas auxiliares, helpers, validações agnósticas a UI.
- `src/types`: Interfaces globais e tipagem forte.

## 4. Convenções e Padrões de Código
- Utilize `PascalCase` para Componentes e `camelCase` para funções e variáveis.
- Sempre crie interfaces para as `props` de componentes e tipagem estrita para retornos de API.
- Todo formulário deve ser gerenciado por `react-hook-form` e suas entradas validadas via `zod`.

## 5. Performance e UX
- Minimizar *re-renders*: use memoização (`useMemo`, `useCallback`) em dados pesados, mas não em todo lugar prematuramente.
- Toda ação crítica (deleções) deve invocar o `DialogProvider`.
- Toda requisição assíncrona mutável (`POST/PUT/DELETE`) deve notificar o usuário com `ToastProvider` e sinalizar carregamento via `useLoading()` ou `<ButtonLoading>`.

## 6. Qualidade de Software e Testes
Baseados na Estratégia de Qualidade (QEF), os seguintes padrões são exigidos:
- **Testes Unitários/Componentes**: Utilizar *Vitest* + *React Testing Library*. A cobertura mínima exigida em Helpers e Validations é de 100%. Componentes core do Design System devem possuir suítes de testes englobando propriedades e estados de acessibilidade (`jest-axe`).
- **Acessibilidade (a11y)**: O projeto espelha as diretrizes WCAG 2.2 AA. Componentes de UI não podem quebrar o fluxo de tabulação (Tab), não podem ignorar rótulos ARIA (em ícones) e devem tratar adequadamente o `aria-live`.
- **Performance**: Monitoramento contínuo das Web Vitals (LCP < 2.5s, CLS < 0.1). Evitar blocos síncronos pesados na renderização crítica.
- **Integração e E2E**: Testes End-to-End são conduzidos pelo *Playwright*. Caminhos felizes vitais não sobem para Master/Main caso o Playwright acuse regressão.

## 7. Definition of Done (DoD) e Quality Gate
Uma tarefa só está pronta se:
- `npm run lint` passa sem erros e sem warnings relacionados à nova implementação.
- `npm run build` conclui com êxito.
- Arquitetura respeita o diagrama descrito no `PLATFORM_GUIDE.md`.
- Testes foram providenciados mantendo a cobertura geral acima de métricas acordadas.
- Novos componentes de interface testados via `jest-axe` sem falhas.

## 8. Versionamento e Revisão
- Commits devem ser concisos.
- Dívidas Técnicas (`technical_debt.md`) não devem ser introduzidas de forma obscura; precisam estar catalogadas.
- Nenhuma subida de Sprint no `master`/`main` ocorre sem a Revisão Arquitetural formal.
