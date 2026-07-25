# Motion Guidelines

A movimentação e a coreografia são essenciais para um produto "Premium". O movimento na plataforma é **discreto e fluido**, não deve gerar lentidão na percepção do usuário.

## Tempos de Transição (Duration)
- **Fast (`duration-150`):** Mudança simples de opacidade ou cor em links e texto hover.
- **Normal (`duration-300`):** Transições padrão de interface. Movimentos físicos em botões e cards (`translate-y`), expansão de caixas.
- **Slow (`duration-500` a `duration-700`):** Apenas grandes ilustrações (Heros) e backgrounds lentos, trazendo um sentimento orgânico.

## Transições Espaciais (Translate)
- **Cards e CTAs Interativos:** Devem subir 2px ou 4px no eixo Y (`-translate-y-1` ou `-translate-y-2`) para simular gravidade.
- **Escala de Imagem:** Avatares e Hero images sofrem uma leve expansão (`scale-105`) quando engajados para gerar profundidade focal.

## Reduced Motion
- O sistema respeita as configurações do SO do usuário: usamos classes do tailwind como `motion-reduce:transition-none motion-reduce:transform-none` em blocos grandes de cartões.
