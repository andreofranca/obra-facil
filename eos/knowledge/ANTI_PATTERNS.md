# Anti-Padrões (Anti-Patterns)

Este documento documenta os anti-padrões identificados, que são abordagens aparentemente válidas, mas que produzem dívida técnica estrutural, baixa performance ou falhas de arquitetura em longo prazo. Tais práticas devem ser ativamente evitadas durante o design e desenvolvimento.

## 1. Anti-Padrões Arquiteturais

### 1.1. O Monolito Distribuído
* **Descrição:** Uma arquitetura (normalmente descrita como microsserviços) onde os serviços são altamente acoplados, dependendo excessivamente de chamadas síncronas entre si e necessitando de *deploys* coordenados.
* **Como Evitar:** Definir limites claros de domínio (Bounded Contexts), preferir replicação de dados essenciais ou adoção de comunicação assíncrona/orientada a eventos.

### 1.2. Banco de Dados Compartilhado (Shared Database)
* **Descrição:** Diversos serviços independentes lendo e escrevendo diretamente nas mesmas tabelas de um banco de dados centralizado.
* **Como Evitar:** Padrão "Database-per-service". Serviços devem expor dados apenas através de APIs; a camada de persistência é estritamente privada de cada serviço.

### 1.3. O "God Object" (Objeto Deus) ou "God Class"
* **Descrição:** Classes gigantescas que sabem e fazem demais, assumindo múltiplas responsabilidades (ex: `Manager`, `Helper`, `Utils` de milhares de linhas).
* **Como Evitar:** Aplicar o princípio da Responsabilidade Única (SRP) e segregação funcional rigorosa.

## 2. Anti-Padrões de Código e Implementação

### 2.1. Hardcoding
* **Descrição:** Chumbamento de valores dinâmicos (URLs de API, chaves, configurações de ambiente) diretamente no código-fonte.
* **Como Evitar:** Utilizar gestão de variáveis de ambiente, serviços de configuração dinâmicos e cofres de segredos.

### 2.2. Programação Orientada a Exceções (Exception-Driven Development)
* **Descrição:** Utilizar exceções e blocos `try/catch` para controle de fluxo de negócio normal da aplicação.
* **Como Evitar:** Validar estados antes de executar operações; exceções devem ser lançadas exclusivamente em condições excepcionais e imprevistas.

### 2.3. Código Espaguete / Acoplamento Oculto
* **Descrição:** Funções longas, com dependências não declaradas (ex: dependência de estado global ou variáveis estáticas), tornando o teste unitário impossível sem subir todo o contexto.
* **Como Evitar:** Uso rigoroso de Injeção de Dependências, passagem explícita de parâmetros e desenvolvimento orientado a testes (TDD).

## 3. Anti-Padrões de Gerenciamento e Processo

### 3.1. "Vai Funcionar na Minha Máquina"
* **Descrição:** Aceitação implícita de que, se o código funciona no ambiente de desenvolvimento local, a responsabilidade do desenvolvedor acabou.
* **Como Evitar:** Utilização extensiva de *containers* (ex: Docker) para equalização de ambientes, esteiras robustas de CI/CD, e validação mandatória em ambiente de Homologação.

### 3.2. Technical Debt Sweeping (Empurrar a Dívida Técnica para Debaixo do Tapete)
* **Descrição:** Constantemente priorizar a entrega de novas funcionalidades sacrificando a correção de dívidas técnicas ou bugs menores sem nunca pagá-las.
* **Como Evitar:** Alocar, obrigatoriamente, uma fatia do backlog da *sprint* (ex: 20%) para mitigação de dívida técnica e refatoração preventiva.
