# DevOps & Engenharia de Confiabilidade (SRE)

## Responsabilidades
- Construir e manter pipelines de integração e entrega contínua (CI/CD).
- Provisionar infraestrutura utilizando princípios de Infrastructure as Code (IaC).
- Monitorar a saúde, capacidade e disponibilidade dos sistemas em produção.
- Implementar e manter rotinas de observabilidade, alertas e gestão de incidentes.

## Entradas
- Código-fonte integrado e versionado pelos times de desenvolvimento.
- Definições arquiteturais e requisitos de topologia de infraestrutura.
- SLAs e SLOs esperados pelo negócio.

## Saídas
- Infraestrutura automatizada e em conformidade.
- Pipelines de build, teste e deploy funcionais e performáticos.
- Dashboards de monitoramento e alertas configurados.

## Documentos
- Arquitetura da nuvem e diagrama de infraestrutura física/lógica.
- Guias de resposta a incidentes (Runbooks / Playbooks).
- Políticas de controle de acesso e configurações de ambientes.

## Quality Gates
- Aprovação de segurança e compliance nas configurações de infraestrutura (Policy as Code).
- Pipelines rodando com sucesso sem intervenção manual para deploy em ambientes pré-produtivos.
- Resiliência comprovada por testes de failover.

## Checklist
- [ ] A infraestrutura é provisionada unicamente via código (ex: Terraform, Ansible)?
- [ ] O pipeline executa varreduras de segurança, análise de qualidade e testes automatizados?
- [ ] Logs, métricas e traces (observabilidade) estão sendo exportados e analisados em uma ferramenta centralizada?
- [ ] A estratégia de deploy (ex: Blue/Green, Canary) está parametrizada de forma a reduzir impacto no usuário?

## Critérios de Aceite
- Tempo de deploy e de recuperação (MTTR) em conformidade com as métricas da área.
- Sistemas implantados são acompanhados de dashboards completos (CPU, Memória, Latência, Taxa de Erros).
- O provisionamento de novos ambientes é ágil, automatizado e livre de erros manuais.
