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
