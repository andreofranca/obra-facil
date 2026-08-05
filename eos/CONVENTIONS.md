# Convenções e Padrões (Conventions)

Este documento estabelece as convenções rigorosas que devem ser aplicadas de maneira uniforme em todos os projetos de desenvolvimento. O objetivo é garantir consistência, legibilidade, facilidade de manutenção e um processo colaborativo eficiente.

## 1. Estrutura de Repositórios
* **Modularidade:** O código deve ser organizado de forma modular, separando responsabilidades (ex: `src/`, `tests/`, `docs/`, `scripts/`).
* **Ponto de Entrada:** Deve existir um ponto de entrada claro e padronizado (ex: `main` ou `index`).
* **Documentação Obrigatória:** Todo repositório deve conter, na raiz, arquivos `README.md` (com instruções de configuração), `CONTRIBUTING.md` (regras de contribuição) e `CHANGELOG.md` (histórico de alterações).

## 2. Nomenclatura (Naming Conventions)
* **Repositórios e Projetos:** `kebab-case` (ex: `servico-pagamento`).
* **Classes e Interfaces:** `PascalCase` (ex: `FaturaCliente`).
* **Métodos, Funções e Variáveis:** `camelCase` (ex: `calcularTotal`).
* **Constantes:** `UPPER_SNAKE_CASE` (ex: `TAXA_JUROS_MAXIMA`).
* **Arquivos e Diretórios:** `kebab-case` para a maioria das linguagens, exceto quando as convenções da linguagem específica ditar em contrário (ex: Java classes em `PascalCase.java`). O idioma base para nomenclatura no código é o inglês.

## 3. Versionamento (Versioning)
* Adoção obrigatória do **Semantic Versioning (SemVer) 2.0.0** (`MAJOR.MINOR.PATCH`).
  * `MAJOR`: Mudanças incompatíveis na API/Interface.
  * `MINOR`: Novas funcionalidades compatíveis com versões anteriores.
  * `PATCH`: Correções de falhas (bug fixes) compatíveis com versões anteriores.

## 4. Padrões de Commit (Commit Guidelines)
* Adoção do **Conventional Commits**.
* Formato: `<tipo>[escopo opcional]: <descrição>`
* Tipos aceitos:
  * `feat`: Nova funcionalidade.
  * `fix`: Correção de bug.
  * `docs`: Alteração apenas na documentação.
  * `style`: Alterações de formatação (espaços, vírgulas, etc.).
  * `refactor`: Refatoração de código sem alterar funcionalidade ou corrigir bug.
  * `test`: Adição ou correção de testes.
  * `chore`: Atualização de ferramentas, dependências ou processos de build.

## 5. Estratégia de Branches
* Modelo baseado em **Trunk-Based Development** ou **GitFlow** (conforme definição no início do projeto).
* `main` ou `master`: Sempre reflete o ambiente produtivo.
* `develop` (se GitFlow): Branch de integração principal.
* Branches de Feature/Fix: Devem ramificar e mesclar através de *Pull Requests* (PR) seguindo a nomenclatura: `tipo/ID-DA-TAREFA-descricao-curta` (ex: `feat/PRJ-123-integracao-pix`).

## 6. Sprints e Gestão Ágil
* **Duração Padrão:** Ciclos iterativos de 2 semanas.
* **Cerimônias Obrigatórias:** Planning, Daily, Review e Retrospective.
* **Definição de Pronto (DoD):** Código implementado, testado, revisado, documentado, integrado sem falhas no CI/CD e aprovado no QA.

## 7. Templates e Documentação
* Uso obrigatório de templates para *Pull Requests* e criação de *Issues* (Bugs, Features).
* Toda documentação arquitetural e de decisões deve ser mantida junto ao código como *Architecture Decision Records* (ADR).
* APIs devem ser documentadas obrigatoriamente utilizando a especificação OpenAPI (Swagger).
