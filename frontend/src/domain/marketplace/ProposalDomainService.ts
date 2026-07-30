import { PrismaClient, PropostaStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ProposalDomainService {
  async createProposal(params: {
    solicitacaoId: string;
    profissionalId: string;
    valor: number;
    prazoEstimado: number;
    mensagem?: string;
  }) {
    // Validações poderiam vir aqui (ex: solicitacao existe e está ABERTA)
    return prisma.proposta.create({
      data: {
        solicitacaoId: params.solicitacaoId,
        profissionalId: params.profissionalId,
        valor: params.valor,
        prazoEstimado: params.prazoEstimado,
        mensagem: params.mensagem,
        status: 'PENDENTE'
      }
    });
  }

  async listProposalsBySolicitacao(solicitacaoId: string, userId: string, role: string) {
    // Filtros de segurança baseados no papel
    return prisma.proposta.findMany({
      where: { solicitacaoId },
      include: { profissional: true }
    });
  }
}
