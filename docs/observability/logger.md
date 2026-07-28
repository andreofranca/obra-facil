# Platform Logger

O Logger nativo da plataforma encontra-se no módulo `src/platform/observability/logger/index.ts`.
Ele substitui a dependência local `src/lib/logger.ts` encapsulando uma interface rigorosa (`ILogger`).

## Propósito
- Eliminar o uso desorganizado do `console.log`.
- Centralizar o output em JSON.
- Forçar proteção de PII e chaves criptográficas via `MaskingService`.
- Assossiar metadados vitais via `contextProvider` para que logs dentro do Node tenham automaticamente `correlationId`.

## Transição Gradual
O logger herdado em `src/lib/logger.ts` foi substituído internamente por uma exportação para a capability de Platform. Isso garantiu **retrocompatibilidade total**. Nenhum import existente quebrou. 

Em novas implementações, no entanto, deve-se importar preferencialmente:
`import { logger } from "@/platform/observability"`
