# Design System Compliance
**Status:** COMPLIANT
**Date:** 2026-08-07
**Phase:** Application Shell Consolidation

## 1. Cores e Tema Escuro (Dark Mode)
- Nenhuma tela utiliza classes isoladas de `bg-white` ou `bg-gray-100` em suas raízes.
- **Surface & Cards:** Padronizados com `bg-slate-800/50`, `backdrop-blur-xl` e `border-slate-700/50`.
- **Background Principal:** Padronizado com `bg-slate-950` na raiz e preenchido através do Application Shell.
- **Tipografia:** `text-slate-200` para corpos, `text-slate-400` para legendas (muted) e `text-white` para cabeçalhos (headings).

## 2. Componentes e Espaçamentos
- As propriedades de sombra de elevação foram unificadas via custom tailwind shadows (e.g. `shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]`).
- Ícones injetados via `lucide-react` sempre mantêm a coloração padronizada vinculada à classe text (herdada) e não forçada (`fill` duro).

## 3. Elementos de Formulário (Inputs & Selects)
- **Marketplace e Telas de Cadastro:** Ajustados. Foram erradicadas as forçadas `bg-neutral-white` que destoavam no tema escuro. O componente Select no Marketplace agora utiliza `bg-slate-900/50` e borda `border-slate-700`, com foco `focus:ring-indigo-500`.

## 4. Auditoria de Conformidade Arquitetural
- Não há múltiplos Headers. O antigo `<Header />` que vinha do `@/components/layout` não é mais chamado nas rotas filhas.
- Toda navegação autenticada está envolta pelo `(authenticated)/layout.tsx`, consumindo unicamente o `ApplicationShell.tsx`.
