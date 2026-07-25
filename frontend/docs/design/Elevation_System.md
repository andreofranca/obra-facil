# Elevation & Shadows System

A elevação visual na interface (eixo Z) determina a importância hierárquica e a proximidade do elemento em relação ao usuário. Usamos sombras muito sutis (soft shadows) que conferem o ar premium.

## Z-Index System
- `z-10`: Elementos interativos ou sobreposições locais (ex: setas e contadores decorativos).
- `z-20`: Elementos flutuantes locais.
- `z-30`: Menus dropdown e popovers.
- `z-40`: Overlays, barras fixas e backdrops.
- `z-50`: Headers fixos e sticky navigation.
- `z-max`: Toasts de notificação e Modais globais.

## Sombras (Shadow Tokens)

Substituímos o uso bruto do box-shadow do Tailwind pelas variáveis customizadas de alta precisão.

- **Soft (`--shadow-soft` ou `shadow-soft`):** `0 4px 24px -4px rgba(15, 23, 42, 0.04)`
  - A sombra base. Usada em repouso nos cartões de categorias e profissionais. Quase imperceptível, apenas separa o branco do fundo cinza.
- **Elevated (`--shadow-elevated` ou `shadow-elevated`):** `0 12px 32px -4px rgba(15, 23, 42, 0.08)`
  - Sombra de interação (Hover) ou elementos de destaque primário, como o modal de pesquisa (Hero) e CTA principal.

*Evitar sombras puramente pretas (`rgba(0,0,0)`); a base é construída utilizando as tintas da nossa cor primária/text `rgba(15, 23, 42)`.*
