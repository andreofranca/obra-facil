import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClientePedidosClient } from '@/components/dashboard-cliente/ClientePedidosClient';

export default async function ClientDashboard() {
  const session = await getAuthSession();
  
  if (!session || !session.clienteId) {
    redirect('/login');
  }

  // Fetch real data
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const categorias = await prisma.categoriaServico.findMany({
    take: 8,
  });

  const prosDestaque = await prisma.profissional.findMany({
    where: { ativo: true },
    take: 4,
    orderBy: { obrasExecutadas: 'desc' },
    include: {
      user: true,
      servicos: {
        include: { categoria: true }
      },
      endereco: true
    }
  });

  const favoritos = await prisma.favorito.findMany({
    where: { clienteId: session.clienteId },
    include: {
      profissional: {
        include: { user: true }
      }
    }
  });

  const avaliacoes = await prisma.avaliacaoServico.findMany({
    where: { clienteId: session.clienteId },
    include: {
      profissional: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const solicitacoes = await prisma.solicitarServico.findMany({
    where: { clienteId: session.clienteId },
    include: {
      profissional: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <ClientePedidosClient 
      user={user}
      categorias={categorias}
      prosDestaque={prosDestaque}
      favoritos={favoritos}
      avaliacoes={avaliacoes}
      solicitacoes={solicitacoes}
    />
  );
}
