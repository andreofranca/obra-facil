# Component Guidelines

## Botões (`<Button>`)
- Devem usar transição: `transition-all duration-300`.
- Devem reagir ao Hover: `hover:-translate-y-0.5` ou alteração de contraste da cor.
- Não devem ter cantos perfeitamente agudos. Arredondamentos `rounded-md`, `rounded-xl` ou `rounded-full` a depender da hierarquia (CTAs gigantes pedem `rounded-full`).

## Inputs (`<Input>`)
- Backgrounds sólidos devem ser evitados; dê preferência a outlines suaves e efeitos de "glass".
- Foco absoluto é exigido (`focus-within:ring-2 focus-within:ring-brand-primary`). 

## Cards (`<Card>`)
- Cards nunca são estáticos. Se forem clicáveis, eles devem utilizar `group` e expandir a própria sombra em reposta (usando `--shadow-elevated`).
- Padding interno base recomendado: `p-6`.

## Badges & Tags
- Cores semi-transparentes ao invés de opacas pesadas. 
- Exemplo de verde premium: `bg-green-100 text-green-700` no lugar de `bg-green-500 text-white` para leitura suave.

## Componentes Futuros (Modais e Drawers)
- Devem obrigatoriamente desfocar o fundo (`backdrop-blur-sm`).
- Sombras severas (acima de `shadow-xl`) na camada flutuante.
