# Lições Aprendidas (Lessons Learned)

Este documento é um repositório vivo focado no compartilhamento do conhecimento adquirido, sucessos obtidos e, principalmente, análises construtivas (Post-Mortem) sobre falhas em projetos, implantações ou na arquitetura ao longo do tempo.

## 1. Processo de Coleta de Lições Aprendidas
* **Quando Coletar:** Ao final de cada ciclo significativo de entrega (*Release*), finalização de projetos, e obrigatoriamente em relatórios de resolução de incidentes graves (Post-Mortem de *Downtime*).
* **Ausência de Culpa (Blameless Culture):** A análise de problemas foca sistematicamente em *como* o processo, a arquitetura ou as ferramentas falharam em prevenir o erro, nunca em *quem* cometeu o erro.

## 2. Casos de Incidentes e Mitigações

*(Estrutura de Referência para Registros)*

### [Data / Período] - [Título do Evento ou Projeto]
* **Contexto:** (Breve resumo da situação: O que estava sendo feito? Qual o cenário base?)
* **O que aconteceu (Sintoma/Falha):** (Descrição objetiva da falha, impacto no negócio ou no desenvolvimento).
* **Análise de Causa Raiz (Root Cause):** (Uso da técnica dos "5 Porquês". Ex: Queda de banco de dados por esgotamento de conexões devido à falta de *timeout* em consultas demoradas do relatório X).
* **O que foi aprendido (Lição):**
    * Nunca confiar em limites de conexão padrão do framework de persistência.
    * Sempre isolar cargas de trabalho analíticas pesadas do banco transacional.
* **Plano de Ação Aplicado:**
    * Estabelecido padrão de *Circuit Breaker* global.
    * Implementado alerta de saturação de pool de conexões (Observabilidade).

## 3. Práticas de Sucesso Validadas

*(Estrutura de Referência para Sucessos replicáveis)*

### [Data / Período] - [Prática ou Tecnologia Adotada]
* **Contexto:** Necessidade de escalar drasticamente o processamento de pagamentos durante evento de pico.
* **Ação Executada:** Adoção de enfileiramento assíncrono com escalonamento elástico de *workers* baseados na profundidade da fila.
* **Resultado/Impacto:** Zero quedas durante o evento, tempo de resposta da API principal permaneceu constante.
* **Recomendação Futura:** Padronizar este modelo arquitetural (Padrão: Worker Queue) para qualquer serviço cuja resposta não dependa de execução síncrona imediata para o cliente final.

## 4. Revisão do Documento
Este registro deve ser revisado bimestralmente nas comunidades de prática técnica (Guildas ou CoPs de Engenharia) para garantir que as lições tenham sido traduzidas em regras nos documentos de **Padrões (PATTERNS)**, **Anti-Padrões (ANTI-PATTERNS)** e **Práticas Recomendadas (BEST PRACTICES)**.
