import { PrismaClient, PaymentStatus, TransferStatus } from '@prisma/client';
import { PaymentProvider } from './provider';

// Assume um Prisma client instanciado. Em produção, você pode injetar ou importar de '@/lib/prisma'
const prisma = new PrismaClient();

export class PaymentService {
  constructor(private provider: PaymentProvider) {}

  /**
   * Processa uma cobrança e persiste a transação no banco de dados.
   * Usado quando o cliente paga por um serviço.
   */
  async charge(params: {
    amount: number;
    sourceId: string;
    referenceId: string; // Ex: ID da Proposta ou Solicitação
    currency?: string;
  }) {
    // 1. Criar transação PENDING
    const transaction = await prisma.transaction.create({
      data: {
        amount: params.amount,
        currency: params.currency || 'BRL',
        status: PaymentStatus.PENDING,
        referenceId: params.referenceId,
      },
    });

    try {
      // 2. Chamar provider
      const chargeResult = await this.provider.createCharge({
        amount: params.amount,
        sourceId: params.sourceId,
        currency: params.currency || 'BRL',
        referenceId: params.referenceId,
      });

      // 3. Atualizar estado com base na resposta do provider
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: chargeResult.status as PaymentStatus,
          providerId: chargeResult.providerId,
          metadata: chargeResult.rawResponse,
        },
      });

      return updatedTransaction;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Falha de sistema (rede, timeout, etc)
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.FAILED,
          metadata: { error: error.message },
        },
      });
      throw error;
    }
  }

  /**
   * Repassa o valor para o profissional (Split Payment)
   * Usado quando o serviço é confirmado como concluído pelo cliente.
   */
  async transferToProfissional(transactionId: string, recipientId: string, amount: number) {
    // Busca transação
    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== PaymentStatus.COMPLETED) {
      throw new Error('Cannot transfer funds from an incomplete transaction');
    }

    // Cria registro de transferência PENDING
    const transfer = await prisma.transfer.create({
      data: {
        transactionId,
        recipientId,
        amount,
        status: TransferStatus.PENDING,
      },
    });

    try {
      // Assume que o provider tem as informações bancárias mapeadas pelo recipientId (conta do profissional no provider)
      const transferResult = await this.provider.createTransfer({
        amount,
        recipientId, // Account ID no provider
      });

      // Atualiza registro
      return await prisma.transfer.update({
        where: { id: transfer.id },
        data: {
          status: transferResult.status as TransferStatus,
          providerId: transferResult.providerId,
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      await prisma.transfer.update({
        where: { id: transfer.id },
        data: {
          status: TransferStatus.FAILED,
        },
      });
      throw error;
    }
  }
}
