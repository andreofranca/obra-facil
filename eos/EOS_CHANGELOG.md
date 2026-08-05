# EOS Changelog

Todos os marcos e evoluções arquiteturais da metodologia **Engineering Operating System (EOS)** são documentados neste arquivo.

## [1.0.0] - 2026-08-05
### Adicionado
- **Kernel (`/eos/kernel`)**: Inclusão do motor de execução, ciclo de vida e máquina de estados para disciplinar as Sprints.
- **Workflow e Governança**: Documentação da matriz de responsabilidades e transições do PMO até a Certificação.
- **Knowledge Base (`/eos/knowledge`)**: Repositório centralizado de padrões, best practices e ADRs.
- **Roles Upgrade**: Expansão dos 9 papéis oficiais com entradas, saídas, documentos obrigatórios e Quality Gates detalhados.
- **Conventions & Artifacts**: Definição clara dos artefatos produzidos (Task, Plan, Checkpoint, etc) e das convenções de nomenclatura.
- **Versionamento Independente**: Separação da numeração (Sprints do Framework = EOS-FW-XXX, Ordens de Execução = EOS-EXEC-XXX).

### Modificado
- Evolução da fase puramente documental para a fase procedimental estrita.

### Planejado
- **EOS Automation Layer**: Validação sistêmica via Git Hooks, CI/CD e IA para forçar a Máquina de Estados.
