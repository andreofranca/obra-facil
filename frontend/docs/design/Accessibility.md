# Accessibility (WCAG 2.2)

O ObraFácil garante total inclusão em sua plataforma. 

## Contraste Visual (AAA / AA)
- Todos os textos essenciais de corpo (`Text Primary` e `Text Secondary`) garantem alto contraste com o fundo (`Background` e `Surface`). O cinza claro foi ajustado no Text Secondary para manter leiturabilidade legível e segura.

## Keyboard Navigation & Focus
- É expressamente **proibido remover o outline** global.
- Utilizamos `focus-visible:ring-2 focus-visible:ring-brand-primary` nas tags `<Link>`, `<button>` e `<input>` para que o outline só apareça quando navegado pelo teclado.

## ARIA Attributes
- Seções devem possuir identificadores claros (`aria-labelledby="id-do-titulo"`).
- Componentes unicamente visuais/decorativos (ex: bolhas desfocadas e ícones abstratos) devem levar `aria-hidden="true"`.
- Interações complexas futuras devem manter `aria-expanded` (dropdowns).

## Alt Texts
- Imagens (`<Image />` ou `<img>`) precisam de textos descritivos reais e humanizados se veiculam sentido. Se for avatar genérico decorativo, use `alt=""` (texto vazio).
