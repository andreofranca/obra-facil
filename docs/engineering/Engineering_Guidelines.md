# Engineering Guidelines

## 1. Objetivos da Engenharia
Garantir a estabilidade, escalabilidade, segurança e manutenibilidade do projeto ObraFácil, estabelecendo padrões de alto nível que toda a equipe de engenharia deve seguir rigorosamente durante o desenvolvimento.

## 2. Princípios do Projeto
- **Pensar antes de implementar:** Nenhuma linha de código deve ser escrita sem compreensão do impacto sistêmico.
- **Qualidade acima de Velocidade:** Soluções evolutivas são preferíveis a atalhos técnicos que gerem dívidas.
- **Transparência:** Documentar decisões e comunicar riscos proativamente.

## 3. Padrões de Código (Code Standards)
- **Clean Code:** Escrever código que seja lido e compreendido como uma prosa. Variáveis, funções e classes devem ter nomes claros e intencionais.
- **SOLID:** Seguir os cinco princípios para evitar alto acoplamento e fomentar a coesão no design de software.
- **DRY (Don't Repeat Yourself):** Evitar duplicação de lógica, abstraindo comportamentos repetidos, mas sem criar complexidade prematura.
- **KISS (Keep It Simple, Stupid):** A solução mais simples que resolve o problema é quase sempre a melhor. 
- **YAGNI (You Aren't Gonna Need It):** Implementar estritamente o que foi solicitado. Não adicionar funcionalidades ou abstrações preventivas por "precaução".

## 4. Convenções de Nomenclatura
- **Arquivos/Pastas React:** `kebab-case` para pastas de rotas (app router), `PascalCase` para componentes.
- **Classes/Interfaces:** `PascalCase`.
- **Variáveis/Funções:** `camelCase`.
- **Constantes Globais:** `UPPER_SNAKE_CASE`.

## 5. Organização de Pastas
- Seguir o padrão arquitetural definido.
- Manter regras de negócio isoladas de componentes de UI.
- Evitar arquivos gigantes. Favorecer a modularização funcional.

## 6. Padrão de APIs
- Uso restrito aos contratos pré-estabelecidos. Paginações, filtros e formatações de resposta devem ser consistentes (ex: não alterar a estrutura de Array se isso não foi versionado).
- Utilizar status codes corretos (200, 201, 400, 401, 403, 404, 500).

## 7. Segurança
- Validação estrita de todos os inputs recebidos do cliente.
- Nunca expor chaves ou segredos de infraestrutura no client-side.
- Checar as regras de autorização/papel de usuário (role) em TODAS as mutações e queries.

## 8. Performance
- Evitar problemas de N+1 queries utilizando agregações e selects otimizados.
- Minimizar payload transferido pela rede.
- Fazer uso inteligente de índices no banco de dados.

## 9. Observabilidade
- Todo erro grave deve ser registrado (Logger).
- Mutação de dados sensíveis exige registro de trilha de auditoria (Audit Trail).
- Expor e manter endpoints de Health Check, Liveness e Readiness.

## 10. Tratamento de Erros
- Capturar erros na origem.
- Fornecer respostas polidas ao cliente sem expor o stacktrace (logar a stack trace apenas internamente).

## 11. Revisão de Código
- Código não mergeia sem aprovação.
- O revisor é tão responsável pelo código quanto o autor.
