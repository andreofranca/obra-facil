import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, CheckCircle, Clock, ChevronRight, Info } from "lucide-react";

export const metadata = {
  title: "Financeiro & Propostas | ObraFácil",
  description: "Visão contábil e de valores de serviços contratados.",
};

export default async function FinanceiroPage() {
  const session = await getAuthSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const isPro = session.role === "PROFESSIONAL";

  // Busca propostas reais
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let propostas: any[] = [];
  let totalAcordado = 0;
  let totalEmNegociacao = 0;

  if (isPro && session.profissionalId) {
    propostas = await prisma.proposta.findMany({
      where: { profissionalId: session.profissionalId },
      include: {
        solicitacao: {
          select: {
            id: true,
            titulo: true,
            status: true,
            cliente: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (!isPro && session.clienteId) {
    propostas = await prisma.proposta.findMany({
      where: {
        solicitacao: { clienteId: session.clienteId },
      },
      include: {
        solicitacao: { select: { id: true, titulo: true, status: true } },
        profissional: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  propostas.forEach((p) => {
    const valor = Number(p.valor) || 0;
    if (p.status === "ACEITA") {
      totalAcordado += valor;
    } else if (p.status === "PENDENTE") {
      totalEmNegociacao += valor;
    }
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="flex-1 w-full text-slate-200 font-sans pb-24 overflow-x-hidden pt-8">
      <main className="px-4 sm:px-6 space-y-8 w-full max-w-5xl mx-auto">
        {/* Header Financeiro */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Painel Financeiro & Contratos
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Acompanhe propostas aceitas, valores em negociação e histórico contratual.
              </p>
            </div>
          </div>
        </div>

        {/* Diagnóstico Contábil EOS */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Governança Contábil EOS:</strong> Os valores informados refletem valores acordados em propostas aceitas e valores em negociação. Conforme a diretriz de integridade EOS-2026-049, valores de propostas aceitas não são declarados como &quot;pagamento liquidado&quot; até a confirmação de repasse financeiro do gateway bancário.
          </p>
        </div>

        {/* Resumo Financeiro Real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isPro ? "Valor Acordado em Custódia (Escrow)" : "Total Contratado em Serviços"}
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {formatCurrency(totalAcordado)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Referente a propostas aceitas pelo cliente
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isPro ? "Valor em Negociação (Propostas Enviadas)" : "Propostas em Análise"}
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {formatCurrency(totalEmNegociacao)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Aguardando confirmação ou aprovação
            </p>
          </div>
        </div>

        {/* Lista de Registros Contratuais Reais */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Histórico de Propostas e Valores ({propostas.length})
            </h2>
          </div>

          {propostas.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-white">Nenhum registro financeiro encontrado</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {isPro
                  ? "Envie propostas para os pedidos de serviços disponíveis para acompanhar suas oportunidades financeiras aqui."
                  : "Suas solicitações de serviço com propostas recebidas serão consolidadas nesta área."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {propostas.map((prop) => {
                const statusColor =
                  prop.status === "ACEITA"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : prop.status === "PENDENTE"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-slate-800 text-slate-400 border-slate-700";

                const interlocutor = isPro
                  ? prop.solicitacao?.cliente?.user?.name || "Cliente"
                  : prop.profissional?.user?.name || "Profissional";

                return (
                  <div key={prop.id} className="p-6 hover:bg-slate-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}>
                          {prop.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          Enviada em {new Date(prop.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {prop.solicitacao?.titulo || "Solicitação de Serviço"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isPro ? `Contratante: ${interlocutor}` : `Profissional: ${interlocutor}`} • Prazo proposto: {prop.prazoDias} dias
                      </p>
                    </div>

                    <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-base font-extrabold text-white">
                        {formatCurrency(Number(prop.valor))}
                      </span>
                      {prop.solicitacao?.id && (
                        <Link
                          href={isPro ? `/profissional/pedidos/${prop.solicitacao.id}` : `/minhas-solicitacoes/${prop.solicitacao.id}`}
                          className="text-xs text-brand-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          Acessar Pedido
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
