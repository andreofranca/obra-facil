import type { AuthUserRole } from "./auth";

export type AutorMensagemChat = {
  id: string;
  nome: string;
  role: AuthUserRole;
} | null;

export type MensagemChat = {
  id: string;
  solicitacaoId: string;
  usuarioId: string | null;
  autor: AutorMensagemChat;
  mensagem: string;
  createdAt: string;
};

export type HistoricoChat = {
  solicitacaoId: string;
  mensagens: MensagemChat[];
};

export type PayloadCriacaoMensagem = {
  solicitacaoId: string;
  usuarioId: string;
  mensagem: string;
};

export type ConversaItem = {
  id: string; // solicitacaoId
  titulo: string;
  status: import("./solicitacao").SolicitacaoServicoStatus;
  createdAt: string;
  updatedAt: string;
  interlocutor: {
    id: string;
    nome: string;
    role: "CLIENT" | "PROFESSIONAL";
    email?: string;
  };
  ultimaMensagem?: {
    id: string;
    mensagem: string;
    createdAt: string;
    autorNome?: string;
  } | null;
  totalMensagens: number;
};
