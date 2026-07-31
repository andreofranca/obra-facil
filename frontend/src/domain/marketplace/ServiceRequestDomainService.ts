// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient, SolicitacaoStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ServiceRequestDomainService {
  async createRequest(params: {
    clienteId: string;
    titulo: string;
    descricao: string;
  }) {
    return prisma.solicitarServico.create({
      data: {
        clienteId: params.clienteId,
        titulo: params.titulo,
        descricao: params.descricao,
        status: 'ABERTA',
        updatedAt: new Date()
      }
    });
  }

  async cancelRequest(solicitacaoId: string, clienteId: string) {
    const solicitacao = await prisma.solicitarServico.findUnique({ where: { id: solicitacaoId } });
    if (!solicitacao) throw new Error('Solicitação não encontrada');
    if (solicitacao.clienteId !== clienteId) throw new Error('Ação permitida apenas para o cliente proprietário');

    // RN006: Cancelamento
    return prisma.solicitarServico.update({
      where: { id: solicitacaoId },
      data: { status: 'CANCELADA', updatedAt: new Date() }
    });
  }
}
