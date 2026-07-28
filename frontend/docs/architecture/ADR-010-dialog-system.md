# ADR 010: Dialog System

## Contexto
Ações destrutivas ou de confirmação requerem confirmações por parte do usuário. Historicamente, modais eram importados em cada tela, tendo seu estado (`isOpen`, `setIsOpen`) gerenciado localmente de forma verbosa.

## Problema
Boilerplate excessivo em telas para controlar modais. Inconsistência na forma de apresentar alertas críticos.

## Alternativas
1. Instanciar `<Modal>` isolado em cada componente que precisa dele.
2. Utilizar bibliotecas (ex: `radix-ui/react-dialog`).
3. Criar um contexto imperativo global (`DialogProvider`).

## Decisão
Criar o `DialogProvider` com o hook `useDialog()`, habilitando invocações via código (imperativas): `dialog.confirm({ ... })`.

## Consequências
- **Positivas**: Limpa drasticamente o markup dos componentes de tela. Impede a coexistência de múltiplos modais acidentais de confirmação na mesma árvore.
- **Negativas**: Só permite exibir um `GlobalDialog` por vez por contexto. Casos muito customizados (com formulários imensos) ainda precisarão de modais locais convencionais.
