import ProfissionalPedidosClient from '@/components/profissional/ProfissionalPedidosClient';
import { PrismaClient } from '@prisma/client';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'CRM Comercial | Dashboard do Profissional',
  description: 'Gerencie seus pedidos, agenda, receitas e muito mais.',
};

export default async function ProfissionalPedidosPage() {
  const session = await getAuthSession();
  const prisma = new PrismaClient();

  if (!session?.userId) {
    redirect('/auth/login');
  }

  const profissional = await prisma.profissional.findUnique({
    where: { userId: session.userId }
  });

  if (!profissional) {
    redirect('/');
  }

  const proposals = await prisma.proposta.findMany({
    where: { profissionalId: profissional.id },
    include: {
      solicitacao: {
        include: {
          cliente: {
            include: {
              user: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const acceptedOrFinished = proposals.filter(p => p.status === 'ACEITA' || p.solicitacao.status === 'FINALIZADA');
  const revenue = acceptedOrFinished.reduce((acc, p) => acc + Number(p.valor || 0), 0);
  const conversion = proposals.length > 0 ? ((acceptedOrFinished.length / proposals.length) * 100).toFixed(0) : '0';

  const metrics = {
    revenue: `R$ ${revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    conversion: `${conversion}%`,
    totalRequests: proposals.length,
    activeRequests: proposals.filter(p => p.status === 'PENDENTE' || p.solicitacao.status === 'EM_EXECUCAO').length
  };

  const messages = await prisma.mensagemSolicitacao.findMany({
    where: {
      solicitacao: { profissionalId: profissional.id }
    },
    include: {
      autor: true,
      solicitacao: true
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const avaliacoes = await prisma.avaliacaoServico.findMany({
    where: { profissionalId: profissional.id },
    include: { cliente: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const clientStats: Record<string, { id: string; name: string; services: number; revenue: number }> = {};
  acceptedOrFinished.forEach(p => {
    const cId = p.solicitacao.clienteId;
    if (!clientStats[cId]) {
      clientStats[cId] = {
        id: cId,
        name: p.solicitacao.cliente.user.name,
        services: 0,
        revenue: 0
      };
    }
    clientStats[cId].services += 1;
    clientStats[cId].revenue += Number(p.valor);
  });
  const topClientes = Object.values(clientStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Convert dates and Decimal for Client Component
  const serializableProposals = proposals.map(p => ({
    id: p.id,
    valor: Number(p.valor),
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    solicitacao: {
      id: p.solicitacao.id,
      titulo: p.solicitacao.titulo,
      descricao: p.solicitacao.descricao,
      status: p.solicitacao.status,
      createdAt: p.solicitacao.createdAt.toISOString(),
      cliente: {
        nome: p.solicitacao.cliente.user.name
      }
    }
  }));

  const serializableMessages = messages.map(m => ({
    id: m.id,
    name: m.autor?.name || 'Sistema',
    msg: m.mensagem,
    time: m.createdAt.toISOString(),
    unread: m.usuarioId !== session.userId // simplistic check
  }));

  const serializableAvaliacoes = avaliacoes.map(a => ({
    id: a.id,
    name: a.cliente.user.name,
    nota: a.nota,
    comentario: a.comentario
  }));

  return (
    <ProfissionalPedidosClient 
      metrics={metrics} 
      requests={serializableProposals}
      messages={serializableMessages}
      topClientes={topClientes}
      avaliacoes={serializableAvaliacoes}
    />
  );
}
