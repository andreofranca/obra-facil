// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient, SolicitacaoStatus, PropostaStatus } from '@prisma/client';
import { PaymentService } from '@/lib/payments/service';

const prisma = new PrismaClient();

export class ContractingDomainService {
  constructor(private paymentService: PaymentService) {}

  /**
   * Aceita uma proposta e atualiza o estado da solicitação e propostas concorrentes.
   * Realiza cobrança em escrow via PaymentService.
   */
  async acceptProposal(proposalId: string, clientId: string) {
    const proposta = await prisma.proposta.findUnique({ where: { id: proposalId } });
    if (!proposta) throw new Error('Proposta não encontrada');
    if (proposta.status === 'ACEITA') throw new Error('Proposta já aceita');

    const solicitacao = await prisma.solicitarServico.findUnique({ where: { id: proposta.solicitacaoId } });
    if (!solicitacao) throw new Error('Solicitação não encontrada');
    if (solicitacao.clienteId !== clientId) throw new Error('Ação permitida apenas para o cliente proprietário');

    // RN014 & RN015: Transação atômica
    const transactionResult = await prisma.$transaction(async (tx) => {
      const alreadyAccepted = await tx.proposta.findFirst({
        where: { solicitacaoId: proposta.solicitacaoId, status: 'ACEITA' },
      });

      if (alreadyAccepted) {
        throw new Error('Já existe uma proposta aceita para esta solicitação');
      }

      // 1. Marca a proposta como ACEITA
      const acceptedProposal = await tx.proposta.update({
        where: { id: proposalId },
        data: { status: 'ACEITA', updatedAt: new Date() },
      });

      // 2. Recusa as demais
      await tx.proposta.updateMany({
        where: { solicitacaoId: proposta.solicitacaoId, id: { not: proposalId } },
        data: { status: 'RECUSADA', updatedAt: new Date() },
      });

      // 3. Atualiza Solicitação para ACEITA e atribui o profissional
      const updatedSolicitacao = await tx.solicitarServico.update({
        where: { id: proposta.solicitacaoId },
        data: { 
          status: 'ACEITA', 
          profissionalId: proposta.profissionalId,
          updatedAt: new Date() 
        },
      });

      return { acceptedProposal, updatedSolicitacao };
    });

    try {
      // 4. Integração com Payments: Cria Charge no valor da proposta (Escrow)
      // Nota: o sourceId deve vir do front-end na vida real (ex: token do cartão do usuário)
      // Estamos fixando um mock-token temporariamente para manter o fluxo compatível.
      await this.paymentService.charge({
        amount: Number(proposta.valor),
        sourceId: 'valid-token', 
        referenceId: proposta.id,
        currency: 'BRL'
      });
    } catch (paymentError) {
      // Falha no pagamento: Em um sistema real, a transação seria revertida (compensating transaction) 
      // ou ficaria aguardando tentativa. Por simplicidade do MVP, lançamos o erro.
      throw new Error(`Falha ao processar pagamento: ${paymentError}`);
    }

    return transactionResult.acceptedProposal;
  }

  /**
   * Recusa uma proposta específica
   */
  async rejectProposal(proposalId: string, clientId: string) {
    const proposta = await prisma.proposta.findUnique({ where: { id: proposalId } });
    if (!proposta) throw new Error('Proposta não encontrada');
    if (proposta.status === 'ACEITA') throw new Error('Proposta aceita não pode ser modificada');

    const solicitacao = await prisma.solicitarServico.findUnique({ where: { id: proposta.solicitacaoId } });
    if (!solicitacao || solicitacao.clienteId !== clientId) {
      throw new Error('Ação permitida apenas para o cliente proprietário');
    }

    return prisma.proposta.update({
      where: { id: proposalId },
      data: { status: 'RECUSADA', updatedAt: new Date() },
    });
  }
}
