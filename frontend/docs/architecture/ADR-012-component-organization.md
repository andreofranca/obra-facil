# ADR 012: Component Organization

## Contexto
Durante a Sprint de estabilização da Platform Experience (PX), criou-se uma indefinição sobre onde alocar componentes com caráter misto de "visual" e "infraestrutura", como `Skeleton`, `EmptyState` e `LoadingOverlay`.

## Problema
Colocar componentes visuais dentro de `src/platform/` diluiria o propósito dessa camada, que deve conter apenas lógicas puras, provedores de contexto, integrações sistêmicas e adaptadores (wrappers estruturais). 

## Alternativas
1. Colocar tudo sob `src/platform/`.
2. Segmentar a organização respeitando a natureza atômica do elemento. Elementos de infraestrutura invisíveis ou abstratos em `platform/`, e renderizadores em `components/`.

## Decisão
Decidido usar a Alternativa 2. A pasta `src/platform/` abrigará Providers, Hooks globais e integrações (Dialogs, Notifications, Theme, Icons wrapper base).
Componentes puramente visuais, mesmo pertencendo à base da "Plataforma" (como `CardSkeleton`, `EmptyState`, etc), residirão em `src/components/feedback/` ou categorias apropriadas no Design System.

## Consequências
- **Positivas**: Forte coesão visual. Designers e desenvolvedores de Front-end saberão que toda a parte de marcação JSX reutilizável está em `components/`. O diretório `platform/` permanece como o "motor" (engine) do app.
- **Negativas**: A fronteira pode parecer tênue para novos membros, exigindo leitura do `PLATFORM_GUIDE.md`.
