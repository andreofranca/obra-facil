# Processo de Release (Release Process)

Este documento dita o fluxo oficial e inalterável pelo qual o código evolui no projeto ObraFácil até atingir o ambiente de produção. Nenhuma etapa pode ser pulada.

## Fluxo Oficial

O ciclo de vida de uma funcionalidade obedece a seguinte ordem cronológica:

### 1. Sprint
A funcionalidade entra no ciclo de desenvolvimento, contendo uma Definition of Ready (DoR) plenamente atendida e documentada. O desenvolvedor compreende exatamente o que precisa ser construído.

### 2. Implementação
O desenvolvimento ocorre incrementando código, adotando as *Engineering Guidelines* e garantindo que tudo está modular, seguro e limpo. A atividade atinge a Definition of Done (DoD).

### 3. Review (Code Review)
O Pull Request é submetido à revisão e passa obrigatoriamente pelos critérios do `Code_Review_Checklist.md`. Nenhuma mutação de banco ou API não retrocompatível é mesclada sem inspeção de auditoria.

### 4. Build
Validações automatizadas são deflagradas:
- `npm run lint` passa sem warnings severos.
- `npm run build` transpila e atesta a ausência de erros de Server Side Rendering / Tipagem TypeScript.

### 5. Checkpoint
A bateria de testes, logs e saúde arquitetural confirmam estabilidade. O artefato é avaliado contra os requisitos de negócio pelo Lead Engineer e/ou QA, gerando o sinal verde de maturidade da branch principal.

### 6. Git Tag
O código recebe a marcação semântica da versão (Semantic Versioning) correspondente à fase do checkpoint atual (ex: `v0.9.9-beta2` ou `v1.0.0`). Esta Tag cristaliza o código imutável.

### 7. Release
O Deploy finaliza a promoção da branch aprovada e *Tagueada* para o ambiente produtivo. Release Notes (notas de lançamento) são vinculadas automaticamente à versão, oficializando as mudanças sistêmicas publicadas aos usuários.
