# Inventário de Defeitos (Defects)

Esta lista contém todos os problemas e riscos catalogados durante a auditoria funcional utilizando os dados do Seed Foundation.

| ID | Tela/Componente | Severidade | Passos para Reprodução | Resultado Esperado | Resultado Obtido | Sugestão de Correção |
|---|---|---|---|---|---|---|
| DF-001 | API (`api/profissionais`) | P1 (Crítico) | 1. Fazer requisição GET `/api/profissionais` | Retornar lista paginada (ex: 10 em 10). | Retorna integralmente os 90 profissionais carregados do banco. | Implementar paginação (`take` e `skip`) no Prisma Client e repassar metadados ao frontend. |
| DF-002 | Componente (`FeaturedProfessionals`) | P2 (Alto) | 1. Acessar Home | Componente solicitar apenas 4 profissionais via API/DB. | Componente carrega ALL (todos) profissionais no backend e recorta no frontend via `.slice(0, 4)`. | Passar um parâmetro de limite para a service `getProfissionais(4)` e fazer Prisma retornar `take: 4`. |
| DF-003 | Componente (`FeaturedProfessionals`) | P3 (Médio) | 1. Acessar Home e visualizar cards | Exibir localização real do profissional. | Exibe a string hardcoded "São Paulo, SP" em todos os cards. | Extrair localização da relação `profissional.endereco.cidade/estado`. |
| DF-004 | Componente (`FeaturedProfessionals`) | P3 (Médio) | 1. Acessar Home e olhar cards sem avaliação | Exibir "Novo" ou Empty State. | Calcula um número fake de reviews se count = 0 e atribui Nota 5. | Remover mockup de falsificação de rating. Inserir tag de "Novo na plataforma" quando count for 0. |
| DF-005 | Formulários (Lint) | P3 (Médio) | 1. Rodar `npm run lint` | 0 warnings. | Aparece um warning do `react-hooks/incompatible-library` no uso do `watch()` do React Hook Form. | Refatorar para usar `useWatch()` caso precise assinar a campos inteiros, a fim de evitar re-renders globais excessivos. |

### Legenda de Severidade
- **P0**: Blockers/Quebra total de aplicação ou Vazamento de Dados.
- **P1**: Funcionalidade severamente comprometida, gargalo agudo de desempenho.
- **P2**: Degradação funcional que não quebra o sistema, mas piora a usabilidade gravemente (ex: tráfego enorme na rede).
- **P3**: Problemas cosméticos ou inofensivos em baixa escala.
