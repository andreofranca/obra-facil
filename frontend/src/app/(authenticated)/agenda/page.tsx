import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, User, ChevronRight, Info } from "lucide-react";

export const metadata = {
  title: "Agenda de Compromissos | ObraFácil",
  description: "Acompanhe seus serviços e compromissos agendados.",
};

const statusColors: Record<string, string> = {
  ACEITA: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  EM_EXECUCAO: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  AGUARDANDO_CONFIRMACAO: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  CONCLUIDA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FINALIZADA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const statusLabels: Record<string, string> = {
  ACEITA: "Serviço Acordado",
  EM_EXECUCAO: "Em Execução",
  AGUARDANDO_CONFIRMACAO: "Aguardando Confirmação",
  CONCLUIDA: "Concluído",
  FINALIZADA: "Finalizado",
};

export default async function AgendaPage() {
  const session = await getAuthSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const isPro = session.role === "PROFESSIONAL";

  // Busca apenas solicitações ativas ou concluídas reais vinculadas ao usuário
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const solicitacoes: any[] = isPro
    ? session.profissionalId
      ? await prisma.solicitarServico.findMany({
          where: {
            profissionalId: session.profissionalId,
            status: { in: ["ACEITA", "EM_EXECUCAO", "AGUARDANDO_CONFIRMACAO", "CONCLUIDA", "FINALIZADA"] },
          },
          include: {
            cliente: { include: { user: { select: { name: true, phone: true } } } },
            propostas: { where: { status: "ACEITA" }, take: 1 },
          },
          orderBy: { updatedAt: "desc" },
        })
      : []
    : session.clienteId
    ? await prisma.solicitarServico.findMany({
        where: {
          clienteId: session.clienteId,
          status: { in: ["ACEITA", "EM_EXECUCAO", "AGUARDANDO_CONFIRMACAO", "CONCLUIDA", "FINALIZADA"] },
        },
        include: {
          profissional: { include: { user: { select: { name: true, phone: true } } } },
          propostas: { where: { status: "ACEITA" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div className="flex-1 w-full text-slate-200 font-sans pb-24 overflow-x-hidden pt-8">
      <main className="px-4 sm:px-6 space-y-8 w-full max-w-5xl mx-auto">
        {/* Header da Agenda */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Agenda de Compromissos
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Serviços contratados e etapas de execução vinculados à sua conta.
              </p>
            </div>
          </div>
        </div>

        {/* Nota Técnica de Domínio */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Diagnóstico de Domínio:</strong> Esta visualização lista exclusivamente serviços com status acordado ou em andamento. O agendamento de data e horário específico de visita técnica está mapeado no roadmap de extensões do MVP (missão subsequente).
          </p>
        </div>

        {/* Lista de Compromissos Reais */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Compromissos Registrados ({solicitacoes.length})
            </h2>
          </div>

          {solicitacoes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-white">Nenhum compromisso ativo no momento</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {isPro
                  ? "Assim que você aceitar uma solicitação de serviço ou tiver uma proposta aceita por um cliente, os detalhes de execução aparecerão aqui."
                  : "Quando uma proposta de serviço for aceita, o cronograma e os dados do profissional responsável serão listados nesta agenda."}
              </p>
              <div className="pt-2">
                <Link
                  href={isPro ? "/profissional/pedidos" : "/solicitar-servico"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
                >
                  {isPro ? "Explorar Pedidos Disponíveis" : "Publicar Nova Solicitação"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {solicitacoes.map((item) => {
                const interlocutorName = isPro
                  ? item.cliente?.user?.name || "Cliente"
                  : item.profissional?.user?.name || "Profissional Responsável";
                const interlocutorPhone = isPro
                  ? item.cliente?.user?.phone
                  : item.profissional?.user?.phone;
                const propostaAceita = item.propostas?.[0];

                return (
                  <div key={item.id} className="p-6 hover:bg-slate-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[item.status] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
                          {statusLabels[item.status] || item.status}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-brand-primary transition-colors">
                        <Link href={isPro ? `/profissional/pedidos/${item.id}` : `/minhas-solicitacoes/${item.id}`}>
                          {item.titulo}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {interlocutorName} {interlocutorPhone ? `(${interlocutorPhone})` : ""}
                        </span>
                        {propostaAceita && (
                          <span className="text-emerald-400 font-medium">
                            Prazo Acordado: {propostaAceita.prazoDias} dias
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Link
                        href={isPro ? `/profissional/pedidos/${item.id}` : `/minhas-solicitacoes/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                      >
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
