# Engineering Constitution

Esta constituição rege todas as decisões técnicas e operacionais no desenvolvimento do ObraFácil. Ela atua como a autoridade máxima, e os Engenheiros e a Plataforma devem respeitá-la e aplicá-la em todos os Épicos (EPICs).

## Princípios Fundamentais
1. **Arquitetura antes de Funcionalidade:** Nenhuma funcionalidade de negócio é implementada sem que a capability sistêmica necessária para suportá-la exista de forma sólida e escalável.
2. **Quality Gate Não Negociável:** O processo de CI/CD, lint, testes automatizados e builds sem warnings compõe a barreira de aprovação. Reduzir a cobertura de testes é proibido.
3. **Plataforma Agnóstica:** Dependências externas (libs e serviços cloud) devem ser isoladas e envelopadas por interfaces na camada de Platform (ex: `ILogger`).
4. **Resiliência e Fail-Safe:** Nenhuma falha em capability não-crítica (ex: métricas) deve inviabilizar o fluxo de negócio do usuário.
5. **Transparência e Observabilidade:** Tudo deve ser rastreável. Códigos sem monitoramento são considerados códigos quebrados.
6. **Maturidade Documental:** Todo componente arquitetural e capability de plataforma exige um Architecture Decision Record (ADR) associado e atualização da documentação respectiva.

## Default Engineering Behavior
Se a decisão estiver dentro da autoridade do engenheiro e não alterar arquitetura, contratos públicos ou regras de negócio, execute sem solicitar autorização. A produtividade e o bom andamento (flow) não devem ser engessados por micro-gerenciamento.

## Silent Improvements
Durante qualquer execução o engenheiro poderá:
- Melhorar nomes (variáveis, funções, classes);
- Melhorar comentários e documentação;
- Melhorar a organização de código (espaçamentos, agrupamentos);
- Melhorar ou criar testes;
- Remover duplicação localizada;
- Corrigir pequenos bugs encontrados durante a implementação.

**Desde que:**
- Não altere o comportamento externo;
- Não altere a arquitetura (fluxos, dependências macro);
- Não altere contratos públicos (interfaces, payloads, schemas da API);
- Não altere regras de negócio.
