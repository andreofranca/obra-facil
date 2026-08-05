# Governança (Governance)

Este documento define a governança técnica do Sistema Operacional de Engenharia (EOS). Ele estabelece claramente os papéis, responsabilidades e os ritos necessários para a evolução estruturada, aprovação, execução, certificação e manutenção da padronização tecnológica em toda a organização.

## 1. Papéis e Responsabilidades

### 1.1. Modificação e Evolução do EOS
* **Quem Propõe Modificações:** Qualquer membro do time de tecnologia (Desenvolvedores, QAs, DevOps, Arquitetos) possui a liberdade de propor melhorias, novos padrões ou exclusão de práticas obsoletas nos documentos do EOS via *Pull Request* ou *Request For Comments (RFC)*.
* **Quem Aprova Modificações:** As modificações no núcleo do EOS devem ser formalmente aprovadas pelo **Comitê Técnico / Architecture Review Board (ARB)** e lideranças seniores de engenharia (Staff/Principal Engineers).
* **Como são Lançadas Novas Versões:** O EOS segue um versionamento explícito (ex: EOS v1.0). Atualizações críticas ou grandes mudanças de paradigma geram novas *majors*, enquanto ajustes menores geram *minors*. A liberação ocorre através de ritos de comunicação institucional e documentação centralizada.

### 1.2. Ciclo de Vida de Software (Workflow)
As fases de workflow e as entidades responsáveis por cada etapa são fixadas da seguinte forma:

* **Quem Executa (Desenvolvimento):** 
  * Equipes ágeis de desenvolvimento de produto (Squads/Tribos), compostas por especialistas de Backend e Frontend. A execução deve seguir estritamente o código e as regras estabelecidas no EOS.
* **Quem Valida Qualidade:**
  * O time de **QA (Quality Assurance)** é responsável pela execução autônoma e aprovação (Quality Gate) das validações funcionais, não funcionais e de segurança da esteira.
* **Quem Aprova o Negócio:**
  * O **PMO (Project Management Office)** e os *Product Owners / Stakeholders* são responsáveis por realizar a homologação e assinar o aceite formal (*Sign-off*) do projeto.
* **Quem Certifica a Arquitetura e Padrões:**
  * Profissionais de **Arquitetura de Software / Staff Engineers** garantem, durante a fase de concepção técnica e no momento de *Code Review* contínuo, a conformidade da solução com as diretrizes do EOS (Segurança, Resiliência e Padrões).
* **Quem Publica (Certificação e Deploy):**
  * As equipes de **DevOps / SRE**, através de processos e pipelines automatizados (CI/CD), realizam a certificação final sistêmica, conduzem o *deploy* em produção e iniciam o ciclo de observabilidade operacional.

## 2. Auditoria e Conformidade
* Todo projeto será submetido a verificações de conformidade com o EOS. Ferramentas automatizadas nas esteiras de integração contínua auditarão segurança (SAST/DAST), cobertura de código e padronização.
* Exceções (bypasses) aos padrões documentados no EOS devem ser justificadas tecnicamente e registradas via ADR, exigindo aprovação explícita do ARB. Sem esta exceção registrada, a não conformidade inviabilizará o *deploy* produtivo.

## 3. Disseminação da Governança
A governança não serve apenas como mecanismo de auditoria, mas como instrumento de capacitação. É responsabilidade da liderança técnica fomentar comunidades de prática (Guildas) para discutir as regras ativas, treinando constantemente os times sobre a aplicação prática das normativas descritas neste ecossistema documental.
