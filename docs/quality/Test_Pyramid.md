# A Pirâmide de Testes (Test Pyramid)

Para manter os ciclos de build curtos e obter feedbacks imediatos, aplicaremos o padrão de Pirâmide de Testes ao projeto ObraFácil.

## Formato e Proporções

### 1. Base (70%): Testes Unitários
- Maior quantidade.
- Execução extremamente rápida (milissegundos).
- **Isolamento Total:** Dependências de I/O, network e PrismaClient devem ser estritamente *mockadas*.
- **Alvo:** Funções lógicas, componentes burros de UI (React), formatadores.

### 2. Meio (20%): Testes de Integração
- Quantidade moderada.
- Execução intermédia (segundos).
- **Sem Isolamento:** Validam as rotas da API Next.js interagindo diretamente com um contêiner PostgreSQL efêmero.
- **Alvo:** Endpoints CRUD, checagem de regras de negócio em banco, comportamentos transacionais do Prisma.

### 3. Topo (10%): Testes End-to-End (E2E)
- Menor quantidade.
- Execução demorada (minutos).
- **Ambiente Realista:** Levanta o Front-end, API e Banco em contêineres Docker simultâneos via orquestração e simula o clique do usuário em browser *headless*.
- **Alvo:** Fluxos críticos da plataforma (Cadastro de Clientes, Negociação de Serviço, Checkout/Avaliação).

## Por que essa pirâmide no ObraFácil?
Dado o custo altíssimo de infraestrutura computacional para rotular milhares de chamadas no Next.js Server Components, mockar a base lógica (Unitário) absorve os cenários limítrofes, enquanto o E2E foca puramente no dinheiro e no caminho de conversão (Critical Path).
