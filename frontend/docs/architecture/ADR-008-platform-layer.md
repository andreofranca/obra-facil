# ADR 008: Platform Layer

## Contexto
O projeto ObraFácil tem crescido organicamente e componentes visuais começaram a misturar responsabilidades de negócio e infraestrutura. Precisávamos de um local claro para centralizar soluções transversais da aplicação (notificações, modais, tema, validações globais, wrappers de bibliotecas), isolando-as das lógicas de telas (`pages/`) ou de UI puramente atômica (`components/ui/`).

## Problema
Falta de um padrão arquitetural claro para abrigar a infraestrutura compartilhada (Provider, Hooks globais e integrações com o navegador), dificultando a experiência do desenvolvedor (DX) e a manutenibilidade.

## Alternativas
1. Manter toda a infraestrutura dentro de `src/components/`, criando subpastas como `src/components/providers/`.
2. Utilizar a pasta `src/lib/` para tudo.
3. Criar uma camada oficial `src/platform/`.

## Decisão
Decidimos adotar a alternativa 3: criar a camada `src/platform/`.

## Consequências
- **Positivas**: Separação estrita de responsabilidades. `platform/` lida com a mecânica da UI (Contextos, Wrappers) e `components/` lida apenas com a casca visual. O código fica mais coeso.
- **Negativas**: Leve aumento na complexidade de imports e necessidade de maior documentação inicial para integrar novos desenvolvedores.
