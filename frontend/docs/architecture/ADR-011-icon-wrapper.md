# ADR 011: Icon Wrapper

## Contexto
O projeto utiliza a biblioteca `lucide-react` para iconografia. Como costuma ocorrer com bibliotecas de ícones, os imports estão espalhados em centenas de arquivos na base de código.

## Problema
Acoplamento severo. Se futuramente decidirmos mudar para Heroicons, FontAwesome ou Phosphor, teríamos que refatorar cada página do projeto.

## Alternativas
1. Manter os imports diretos do `lucide-react` nos arquivos.
2. Criar um componente genérico `<Icon>` que mapeia strings (`name="user"`) para a implementação subjacente.

## Decisão
Criar `src/platform/icons/Icon.tsx` e `icons.ts`. Toda a aplicação importará de `@/platform/icons`.

## Consequências
- **Positivas**: Trocar de biblioteca exigirá alteração apenas em `icons.ts` e `Icon.tsx`. O contrato para a UI permanecerá o mesmo.
- **Negativas**: Perdemos o *tree-shaking* automático do Lucide se importarmos todos os ícones no mapa. Contudo, em aplicações de porte médio, o peso agregado não compromete drasticamente, e pode ser otimizado futuramente por meio de separação de *chunks*.
