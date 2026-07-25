# Spacing & Grid System

Nossa escala de espaçamentos garante harmonia vertical e horizontal, seguindo a base de 4px e 8px (Padrão Tailwind).

## Escala de Espaçamento

Tokens mapeados mentalmente para as classes do Tailwind:
- **04px (`p-1`, `gap-1`, `m-1`)**: Micro-ajustes (ex: espaço entre ícone e label).
- **08px (`p-2`, `gap-2`, `m-2`)**: Espaçamento interno de botões e badges.
- **12px (`p-3`, `gap-3`)**: Espaçamentos estruturais mínimos (inputs).
- **16px (`p-4`, `gap-4`)**: Paddings base de seções e mobile layouts.
- **24px (`p-6`, `gap-6`)**: Margens e paddings padrão para Cards premium e grids.
- **32px (`p-8`, `gap-8`)**: Espaçamento maior entre subseções e footers.
- **48px (`p-12`, `py-12`)**: Distância padrão entre componentes horizontais de blocos diferentes.
- **64px (`p-16`, `py-16`)**: Margem vertical entre grandes seções na Home.
- **96px (`p-24`, `py-24`)**: Espaçamento vertical ultra-massivo para heros e grandes blocos textuais isolados (Desktop).

## Border Radius (Arredondamento)

- **Small (`rounded-md`, 6px):** Inputs tradicionais, labels, botões secundários.
- **Medium (`rounded-xl`, 12px):** Cartões internos, ícones destacados e elementos flutuantes.
- **Large (`rounded-2xl` / `rounded-3xl` / `rounded-full`):** Blocos maciços (Card Profile Premium, Call to Actions, Seções arredondadas e o input search do Hero).

## Grid System

O grid é desenhado com a classe `grid` com suporte fluido e responsivo:
- **Mobile (padrão):** 1 coluna (`grid-cols-1`).
- **Tablet (`sm`, `md`):** 2 colunas (`grid-cols-2` ou `grid-cols-3`).
- **Desktop (`lg`):** Até 4 colunas (`grid-cols-4`).

Sempre utilize gaps consistentes: `gap-6` (24px) ou `gap-8` (32px).
