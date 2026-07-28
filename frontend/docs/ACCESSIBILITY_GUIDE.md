# Guia de Acessibilidade (a11y)

Todas as funcionalidades do ObraFácil devem ser desenvolvidas com acessibilidade (a11y) como componente central. Usamos a WCAG 2.2 AA como baliza.

## Regras de Ouro no Desenvolvimento
1. **Semântica Importa**: Use `<button>` para botões e `<a>` para navegação. Nunca use `div onClick` para interações sem definir adequadamente `role="button"` e o evento `onKeyDown` acionado pela tecla `Enter` ou `Space`.
2. **Rótulos (Labels)**: Todo campo de input deve ter uma label associada, seja via `<label htmlFor="...">` ou `aria-label`/`aria-labelledby`.
3. **Foco Visível**: Nunca esconda o anel de foco `outline: none` sem substituí-lo por um estilo customizado (ex: `focus-visible:ring-2`).
4. **Cores e Contraste**: Respeite os tokens do `ThemeProvider` que foram homologados para ter contraste legível mínimo de 4.5:1.

## Automação
- **Unitário (axe)**: Injetamos o `jest-axe` nos componentes para testar passivamente falhas de coloração e ARIA.
- **E2E (Playwright)**: Verificamos o funcionamento prático do foco simulando a tecla Tab.
- **Leitores de Tela**: Para mensagens globais e carregamentos, utilizamos `aria-live="polite"` e `aria-busy="true"`.
