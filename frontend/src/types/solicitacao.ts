export type SolicitacaoServicoStatus =
  | "ABERTA"
  | "EM_ANALISE"
  | "ACEITA"
  | "EM_ANDAMENTO"
  | "CONCLUIDA"
  | "CANCELADA";

export type CriarSolicitacaoServicoPayload = {
  titulo: string;
  descricao: string;
  clienteId: string;
};

export type SolicitacaoServicoCriada = {
  id: string;
  titulo: string;
  descricao: string;
  status: SolicitacaoServicoStatus;
  clienteId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfissionalRelacionadoSolicitacao = {
  id: string;
  nome: string;
} | null;

export type SolicitacaoServicoResumo = {
  id: string;
  titulo: string;
  descricao: string;
  status: SolicitacaoServicoStatus;
  createdAt: string;
  profissional: ProfissionalRelacionadoSolicitacao;
};

export type ClienteResumoSolicitacao = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
};

export type SolicitacaoProfissionalResumo = {
  id: string;
  titulo: string;
  descricao: string;
  status: SolicitacaoServicoStatus;
  createdAt: string;
  cliente: ClienteResumoSolicitacao;
};

export type AtualizarSolicitacaoStatusPayload = {
  status: Exclude<SolicitacaoServicoStatus, "CANCELADA">;
};
