# Máquina de Estados (State Machine)

Para garantir integridade nas solicitações de serviço, foi implementada a \`StateMachine\` na camada de \`domain/service-request\`.

## Estados Válidos:
- ABERTA
- PROPOSTAS
- NEGOCIACAO
- ACEITA
- EM_EXECUCAO
- CONCLUIDA
- CANCELADA
- EXPIRADA
- RECUSADA

## Como Usar:
Nunca modifique \`status\` diretamente com \`prisma.solicitarServico.update\` antes de validar a transição:

\`\`\`typescript
import { StateMachine } from '@/domain/service-request/StateMachine';

const sm = new StateMachine(solicitacao.status);
sm.transitionTo(RequestStatus.CONCLUIDA); // Lança erro se inválido

await prisma.solicitarServico.update({
  where: { id: solicitacao.id },
  data: { status: sm.state }
});
\`\`\`
