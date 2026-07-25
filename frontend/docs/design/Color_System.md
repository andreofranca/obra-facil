# Color System

A paleta de cores do ObraFácil foi consolidada para evitar o excesso de cores e gradientes exagerados, adotando uma base minimalista e utilitária.

## Tokens Principais

- **Primary (`var(--color-brand-primary)`): `#2563EB`** (Blue-600)
  - Uso primário: CTAs, botões principais, links ativos, brand marks.
- **Secondary (`var(--color-brand-secondary)`): `#3B82F6`** (Blue-500)
  - Uso: Hover states do primary, gradientes sutis, ícones decorativos.
- **Background (`var(--color-neutral-background)`): `#F8FAFC`** (Slate-50)
  - Uso: Fundo geral de telas, seções off-white.
- **Surface/Cards (`var(--color-neutral-surface)`): `#FFFFFF`**
  - Uso: Fundo de cards, inputs, dropdowns, modais e Header.
- **Text Primary (`var(--color-neutral-text)`): `#0F172A`** (Slate-900)
  - Uso: Títulos principais (H1 a H6) e corpo de texto com alto contraste.
- **Text Secondary (`var(--color-neutral-muted)`): `#64748B`** (Slate-500)
  - Uso: Subtítulos, descrições, placeholders, rótulos (labels) secundários.
- **Border (`var(--color-neutral-border)`): `#E2E8F0`** (Slate-200)
  - Uso: Divisores estruturais, contorno de inputs inativos e bordas de cards.

## Feedback Colors

- **Success (`var(--color-feedback-success)`): `#22C55E`** (Green-500)
  - Uso: Notificações de sucesso, badges de aprovação.
- **Warning (`var(--color-feedback-warning)`): `#F59E0B`** (Amber-500)
  - Uso: Alertas não-críticos, ícones de avaliação (estrelas).
- **Danger/Error (`var(--color-feedback-error)`): `#EF4444`** (Red-500)
  - Uso: Estados de erro em inputs, mensagens destrutivas, exclusão.

> **Regra de Ouro:** Nunca misture cores semânticas ou adicione tons intermediários no código diretamente (como `bg-blue-300`). Utilize exclusivamente as variáveis CSS definidas em `globals.css`.
