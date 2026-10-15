"use client";

import React, { useState, useMemo } from "react";
import { MessageSquare, Search, ArrowLeft, Clock } from "lucide-react";
import { ChatContainer } from "@/components/chat";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { ConversaItem, MensagemChat } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface MensagensClientProps {
  conversas: ConversaItem[];
  usuarioAtual: {
    id: string;
    name: string;
    role: string;
  };
  initialSelectedId?: string;
}

const statusColorMap: Record<
  SolicitacaoServicoStatus,
  "neutral" | "success" | "warning" | "error" | "info"
> = {
  ABERTA: "neutral",
  PROPOSTAS: "info",
  NEGOCIACAO: "warning",
  ACEITA: "success",
  EM_EXECUCAO: "info",
  CONCLUIDA: "success",
  AGUARDANDO_CONFIRMACAO: "warning",
  FINALIZADA: "success",
  CANCELADA: "error",
  EXPIRADA: "error",
  RECUSADA: "error",
};

const statusLabelMap: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "Aberta",
  PROPOSTAS: "Propostas",
  NEGOCIACAO: "Negociação",
  ACEITA: "Aceita",
  EM_EXECUCAO: "Em andamento",
  CONCLUIDA: "Concluída",
  AGUARDANDO_CONFIRMACAO: "Aguardando",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
  RECUSADA: "Recusada",
};

function formatDataRelativa(dataIso: string) {
  try {
    const data = new Date(dataIso);
    const hoje = new Date();
    const isSameDay =
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();

    if (isSameDay) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(data);
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(data);
  } catch {
    return "";
  }
}

export function MensagensClient({
  conversas,
  usuarioAtual,
  initialSelectedId,
}: MensagensClientProps) {
  const [listaConversas, setListaConversas] = useState<ConversaItem[]>(conversas);
  const [busca, setBusca] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (initialSelectedId && conversas.some((c) => c.id === initialSelectedId)) {
      return initialSelectedId;
    }
    return conversas.length > 0 ? conversas[0].id : null;
  });

  const [showMobileChat, setShowMobileChat] = useState<boolean>(() => {
    return Boolean(selectedId);
  });

  const conversasFiltradas = useMemo(() => {
    if (!busca.trim()) return listaConversas;
    const termo = busca.toLowerCase();
    return listaConversas.filter(
      (c) =>
        c.interlocutor.nome.toLowerCase().includes(termo) ||
        c.titulo.toLowerCase().includes(termo) ||
        (c.ultimaMensagem?.mensagem &&
          c.ultimaMensagem.mensagem.toLowerCase().includes(termo))
    );
  }, [listaConversas, busca]);

  const conversaAtiva = useMemo(() => {
    return listaConversas.find((c) => c.id === selectedId) || null;
  }, [listaConversas, selectedId]);

  const handleSelectConversa = (id: string) => {
    setSelectedId(id);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleMessageSent = (novaMensagem: MensagemChat) => {
    setListaConversas((prev) => {
      const idx = prev.findIndex((c) => c.id === selectedId);
      if (idx === -1) return prev;
      const updatedItem: ConversaItem = {
        ...prev[idx],
        ultimaMensagem: {
          id: novaMensagem.id,
          mensagem: novaMensagem.mensagem,
          createdAt: novaMensagem.createdAt,
          autorNome: novaMensagem.autor?.nome,
        },
        updatedAt: novaMensagem.createdAt,
        totalMensagens: prev[idx].totalMensagens + 1,
      };
      const rest = prev.filter((c) => c.id !== selectedId);
      return [updatedItem, ...rest];
    });
  };

  return (
    <div className="flex-1 w-full text-slate-200 font-sans p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2.5 bg-brand-primary/20 rounded-xl text-brand-primary">
              <MessageSquare size={26} />
            </div>
            Mensagens
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Comunicação direta e segura sobre suas solicitações de serviço.
          </p>
        </div>
      </div>

      {conversas.length === 0 ? (
        /* ESTADO VAZIO: NENHUMA CONVERSA ATIVA */
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Nenhuma conversa ativa no momento
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {usuarioAtual.role === "PROFESSIONAL"
              ? "Você poderá conversar com clientes assim que aceitar solicitações de serviço ou for contratado para um projeto."
              : "Assim que sua solicitação tiver um profissional vinculado ou uma proposta for aceita, você poderá conversar diretamente com ele por aqui."}
          </p>
        </div>
      ) : (
        /* MASTER-DETAIL LAYOUT */
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] h-[calc(100vh-13rem)] shadow-xl">
          {/* PAINEL LATERAL: LISTA DE CONVERSAS (4 COLUNAS EM MD+) */}
          <aside
            className={`md:col-span-5 lg:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-900/40 ${
              showMobileChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* BUSCA NA LISTA */}
            <div className="p-4 border-b border-slate-800/80">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar conversas..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {/* LISTAGEM DE CONVERSAS */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {conversasFiltradas.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Nenhuma conversa encontrada para o termo pesquisado.
                </div>
              ) : (
                conversasFiltradas.map((conversa) => {
                  const isSelected = conversa.id === selectedId;
                  const dataMensagem = conversa.ultimaMensagem
                    ? formatDataRelativa(conversa.ultimaMensagem.createdAt)
                    : formatDataRelativa(conversa.createdAt);

                  return (
                    <button
                      key={conversa.id}
                      onClick={() => handleSelectConversa(conversa.id)}
                      className={`w-full text-left p-4 transition-all duration-200 flex items-start gap-3.5 relative group ${
                        isSelected
                          ? "bg-slate-800/80 border-l-4 border-brand-primary pl-3"
                          : "hover:bg-slate-800/30 text-slate-300"
                      }`}
                    >
                      <Avatar
                        initials={conversa.interlocutor.nome[0] || "?"}
                        className={`w-11 h-11 flex-shrink-0 text-sm font-semibold ${
                          isSelected
                            ? "bg-brand-primary text-white"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3
                            className={`text-sm font-semibold truncate ${
                              isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                            }`}
                          >
                            {conversa.interlocutor.nome}
                          </h3>
                          <span className="text-[11px] text-slate-500 flex-shrink-0 flex items-center gap-1">
                            <Clock size={11} />
                            {dataMensagem}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-xs text-brand-primary/90 font-medium truncate">
                            {conversa.titulo}
                          </p>
                          <Badge
                            tone={statusColorMap[conversa.status] || "neutral"}
                            className="text-[10px] px-2 py-0.5"
                          >
                            {statusLabelMap[conversa.status] || conversa.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-400 truncate">
                          {conversa.ultimaMensagem?.mensagem ? (
                            conversa.ultimaMensagem.mensagem
                          ) : (
                            <span className="italic text-slate-500">
                              Nenhuma mensagem ainda. Inicie a conversa!
                            </span>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* PAINEL CENTRAL: CHAT ATIVO (7 OU 8 COLUNAS EM MD+) */}
          <main
            className={`md:col-span-7 lg:col-span-8 flex flex-col h-full bg-slate-950/60 ${
              showMobileChat ? "flex" : "hidden md:flex"
            }`}
          >
            {conversaAtiva ? (
              <div className="flex flex-col h-full w-full">
                {/* BOTÃO MOBILE DE VOLTAR */}
                <div className="md:hidden p-3 border-b border-slate-800 bg-slate-900/90 flex items-center gap-2">
                  <button
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Voltar para lista
                  </button>
                  <span className="text-xs text-slate-400 truncate">
                    {conversaAtiva.interlocutor.nome} • {conversaAtiva.titulo}
                  </span>
                </div>

                <div className="flex-1 overflow-hidden h-full">
                  <ChatContainer
                    key={conversaAtiva.id}
                    solicitacaoId={conversaAtiva.id}
                    usuarioAtualId={usuarioAtual.id}
                    title={conversaAtiva.interlocutor.nome}
                    subtitle={`${conversaAtiva.titulo} • ${
                      conversaAtiva.interlocutor.role === "PROFESSIONAL"
                        ? "Profissional"
                        : "Cliente"
                    }`}
                    status={conversaAtiva.status}
                    onMessageSent={handleMessageSent}
                  />
                </div>
              </div>
            ) : (
              /* NENHUMA CONVERSA SELECIONADA */
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-600">
                  <MessageSquare size={26} />
                </div>
                <h3 className="text-base font-medium text-slate-300 mb-1">
                  Selecione uma conversa
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Escolha uma conversa na lista à esquerda para visualizar o histórico e enviar mensagens.
                </p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
