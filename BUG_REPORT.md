# BUG REPORT

## Sprint I - Product Hardening

| ID | Área | Sintoma | Status | Prioridade | Resolução |
|----|------|---------|--------|------------|-----------|
| BUG-001 | Autenticação | Middleware ignorava checagem devido ao nome proxy.ts, falhando Edge runtime. | RESOLVIDO | CRÍTICA | Renomeado e refatorado imports. |
| BUG-002 | Autenticação | Crash de Node:crypto e Buffer.from não suportado no Edge Runtime (middleware). | RESOLVIDO | CRÍTICA | Padronizado atob e base64 padding. |
| BUG-003 | Sessão | Ausência de endpoint `/api/auth/session` resultava em falta de sessão no Header. | RESOLVIDO | ALTA | Implementado `session/route.ts`. |
| BUG-004 | Layout | Botões/links "Em Breve" sujando a navbar final. | RESOLVIDO | MÉDIA | Componentes ilustrativos removidos do Header. |
| BUG-005 | Testes E2E | Timeout de conexão nas validações de múltiplas requisições em paralelo devido ao Rate Limiter (`429 Too Many Requests`). | ABERTO | MÉDIA | Como o rate limiter é nativo (5/min), requer mock durante E2E CI/CD. Não impede lançamento operacional. |
