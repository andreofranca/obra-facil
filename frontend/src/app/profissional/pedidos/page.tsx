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

  const acceptedOrFinished = proposals.filter(p => p.status === 'ACEITA');
  const revenue = acceptedOrFinished.reduce((acc, p) => acc + Number(p.valor || 0), 0);
  const conversion = proposals.length > 0 ? ((acceptedOrFinished.length / proposals.length) * 100).toFixed(0) : '0';

  const metrics = {
    revenue: `R$ ${revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    conversion: `${conversion}%`,
    totalRequests: proposals.length,
    activeRequests: proposals.filter(p => p.status === 'PENDENTE' || p.solicitacao.status === 'EM_EXECUCAO').length
  };

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

  return <ProfissionalPedidosClient metrics={metrics} requests={serializableProposals} />;
}
