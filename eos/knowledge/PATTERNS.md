# Padrões de Projeto e Arquitetura (Patterns)

Os padrões listados neste catálogo são soluções estabelecidas para problemas recorrentes no contexto da arquitetura e desenvolvimento. Sua aplicação padroniza soluções, facilita a comunicação entre as equipes e garante escalabilidade técnica.

## 1. Padrões de Arquitetura

### 1.1. Arquitetura de Microsserviços
Para domínios de negócio complexos e equipes distribuídas, o sistema deve ser decomposto em serviços autônomos.
* **Database-per-service:** Cada microsserviço deve possuir sua própria base de dados (ou schema isolado) para garantir a independência.
* **API Gateway:** Utilização de um ponto de entrada único para os clientes (Frontends, Mobile) abstrair o roteamento, autenticação, *rate-limiting* e descoberta de serviços.

### 1.2. Event-Driven Architecture (Arquitetura Orientada a Eventos)
Usada para comunicação assíncrona entre domínios.
* **Publish/Subscribe:** Serviços emitem eventos notórios sobre mudanças de estado, aos quais outros serviços reagem, mantendo forte desacoplamento.
* **Saga Pattern:** Padrão para gerenciamento de transações distribuídas através de compensações, em vez de bloqueios ACID rigorosos.

### 1.3. Clean Architecture / Arquitetura Hexagonal
Aplica-se à estrutura interna das aplicações.
* **Isolamento de Domínio:** A lógica de negócio e as regras do domínio devem residir no centro da arquitetura e não depender de frameworks, bancos de dados ou interfaces de usuário.
* **Portas e Adaptadores:** O acesso a sistemas externos (entrada ou saída) deve ser feito por meio de interfaces (Portas) e implementações específicas (Adaptadores).

## 2. Padrões de Projeto (Design Patterns)

### 2.1. Padrões Criacionais
* **Factory / Abstract Factory:** Utilizados para encapsular e centralizar a lógica de criação de objetos complexos ou famílias de objetos.
* **Singleton:** Aplicado apenas para recursos estritos de sistema, onde uma e apenas uma instância é tolerável (ex: configurações globais, conectores de *pool* de banco - abstraídos).

### 2.2. Padrões Estruturais
* **Adapter (Wrapper):** Essencial para integrar componentes de terceiros ou sistemas legados com a interface esperada pelos novos serviços.
* **Decorator:** Preferível no lugar de heranças múltiplas profundas, permitindo adicionar comportamentos dinamicamente aos objetos.

### 2.3. Padrões Comportamentais
* **Strategy:** Utilizado para permitir que algoritmos ou lógicas de decisão sejam substituídos em tempo de execução sem alterar os clientes que os utilizam.
* **Observer:** Base conceitual dentro da aplicação para implementações de eventos de domínio locais.

## 3. Padrões de Integração e APIs
* **RESTful APIs:** Padrão primário para comunicação síncrona, usando corretamente os verbos HTTP, códigos de status e estruturação baseada em recursos.
* **BFF (Backend for Frontend):** Padrão de API dedicado a fornecer uma interface sob medida para uma experiência de usuário específica, evitando sobrecarga de processamento nos clientes e reduzindo acoplamento.
