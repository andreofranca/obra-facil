# Segurança da Informação (Security / AppSec)

## Responsabilidades
- Proteger sistemas, redes e dados contra ameaças internas e externas.
- Realizar modelagem de ameaças e guiar práticas de Secure by Design.
- Executar análises de vulnerabilidades e testes de invasão (Pentest) estruturados.
- Monitorar e responder a incidentes de segurança cibernética.

## Entradas
- Arquitetura de software e topologia de infraestrutura de TI.
- Código-fonte, dependências de terceiros e imagens de containers.
- Requisitos legais, normativos (ex: LGPD, GDPR) e de conformidade corporativa.

## Saídas
- Relatórios de vulnerabilidade e planos de remediação.
- Políticas de acesso (RBAC, IAM) consolidadas.
- Ferramentas e rotinas de segurança integradas ao pipeline (DevSecOps).

## Documentos
- Relatórios de Penetration Test e análises SAST/DAST/SCA.
- Manuais de conformidade e cartilhas de segurança no desenvolvimento.
- Planos de resposta a incidentes de segurança.

## Quality Gates
- Zero vulnerabilidades críticas ou altas remanescentes antes da promoção para produção.
- Revisão de modelagem de ameaças (Threat Modeling) aprovada.
- Validação da criptografia de dados em trânsito e em repouso.

## Checklist
- [ ] Análises de composição de software (SCA) garantem ausência de bibliotecas vulneráveis?
- [ ] As práticas de codificação segura (ex: contra injeções SQL, XSS, CSRF) foram seguidas estritamente?
- [ ] Chaves de acesso, tokens e segredos estão externalizados via cofres seguros (Secret Managers) e não em código?
- [ ] A auditoria de acessos e monitoramento de logs críticos (Audit Logs) estão operantes?

## Critérios de Aceite
- Assinatura formal de risco emitindo "Go" de segurança para o lançamento.
- Pipeline de integração contínua (CI) efetua os checks de segurança automáticos com sucesso.
- Todas as conformidades regulatórias pertinentes aos dados geridos estão plenamente atendidas.
