# Diretrizes de Logging

A Observabilidade no ObraFácil segue regras rigorosas para garantir diagnóstico eficaz, segurança dos dados do usuário e compatibilidade com agregadores (Datadog, Loki, etc).

## 1. Níveis de Log (Log Levels)
- `debug`: Informações hiper granulares úteis apenas em desenvolvimento ou depuração profunda (ex: conteúdo de payloads não-sensíveis, queries geradas).
- `info`: O caminho feliz. (ex: "Usuário registrado com sucesso", "Proposta enviada").
- `warn`: Comportamento anômalo que não impede o fluxo atual, mas pode sinalizar risco (ex: "Tentativa de login com senha incorreta", "Retry em serviço de e-mail").
- `error`: Exceções explícitas e quebra de fluxo (ex: "Falha na conexão com banco", "NullReferenceException").

## 2. Dados Estruturados
Todo log gerado utilizará a abstração `ILogger`. Nunca concatene variáveis na string.
**Errado:**
`logger.info("Usuário " + userId + " logado")`

**Correto:**
`logger.info("Usuário logado", { userId })`

Isso permite criar dashboards baseados nas chaves do JSON estruturado.

## 3. Máscara de Dados Sensíveis
Jamais inclua em logs:
- Senhas, hashes de senhas.
- Tokens (JWT, OAuth, Refresh).
- Dados de Cartão de Crédito.
- Chaves de API secretas.
O `MaskingService` intercepta as chaves conhecidas, mas cabe ao desenvolvedor evitar envios diretos em chaves desconhecidas.

## 4. Contexto e Rastreamento
O `x-correlation-id` acompanha todo o fluxo via `RequestContext`. Se uma falha ocorreu no Frontend, capture o `correlationId` nos Headers HTTP e procure no agregador para cruzar exatamente o log da API que falhou.
