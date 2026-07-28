# Documentação do Seed de Homologação (Demo)

O projeto ObraFácil contém um script autônomo (idempotente) capaz de preencher o banco de dados com uma massa realista e rica, útil para:
- Demonstrações de produto (Demos)
- Homologação pela equipe de QA
- Testes E2E complexos
- Simulações de usabilidade e responsividade com alto volume de dados (ex: paginação).

## Como executar

Certifique-se de que o banco de dados principal especificado em seu `.env` está em execução. Em seguida, na pasta `/frontend`, execute:

```bash
npm run seed:demo
```

### O que este script gera?
O script baseia-se na biblioteca `@faker-js/faker` para gerar dados localizados no formato brasileiro (`pt_BR`):
- **~25 Categorias**: Profissões base comuns na construção civil.
- **30 Clientes**: Perfis completos.
- **~90 Profissionais**: Cadastrados com endereço geográfico, experiência de anos simulada, descrição longa (lorem ipsum) e serviços iniciais atrelados às categorias.
- **150 Solicitações de Serviço**: Distribuídas aleatoriamente.
  - Solicitações abertas contêm propostas pendentes e simuladas de diversos profissionais.
  - Solicitações concluídas contêm logs de Chat (interação entre Cliente e Profissional) e uma **Avaliação** gerada automaticamente.

### Comportamento (Idempotência)
Toda vez que o script é rodado, ele realiza o *Truncate* (remoção segura seguindo chaves estrangeiras) de todos os dados do banco antes de reinseri-los. Isso garante que a massa não exploda ou gere conflitos com seeds anteriores.
**(Aviso: Não utilize em ambiente de Produção!)**
