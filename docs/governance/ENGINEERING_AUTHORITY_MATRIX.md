# Engineering Authority Matrix

Esta matriz define oficialmente os limites de autonomia do Engenheiro de Software dentro do Engineering Operating System (EOS), visando reduzir interrupções e eliminar decisões repetitivas.

## Decisões Autônomas
O engenheiro pode executar sem solicitar autorização:
- Criação de arquivos dentro da estrutura existente;
- Atualização de documentação obrigatória;
- Atualização do Capability Registry;
- Atualização do Technical Debt Register;
- Atualização do Technical Radar;
- Criação e atualização de testes;
- Correções locais;
- Melhorias de nomenclatura;
- Remoção de código morto comprovadamente não utilizado;
- Organização de módulos;
- Refatorações locais sem alteração de comportamento;
- Melhorias internas de qualidade.

## Decisões que exigem apenas registro
Caso sejam identificadas oportunidades, o engenheiro NÃO deve implementá-las automaticamente, mas sim registrar no relatório final:
- Dívida técnica;
- Melhorias arquiteturais;
- Oportunidades de performance;
- Oportunidades de observabilidade;
- Melhorias de segurança;
- Simplificações futuras.

## Decisões que exigem aprovação da ARB
Obrigatoriamente dependem de aprovação (Architecture Review Board):
- Alteração arquitetural;
- Alteração de domínio;
- Mudança de banco de dados;
- Mudança de framework;
- Alteração incompatível de APIs;
- Quebra de retrocompatibilidade;
- Novas Capabilities;
- Mudanças relevantes de autenticação e autorização;
- Novas dependências estratégicas;
- Alterações de roadmap.
