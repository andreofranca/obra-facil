export type PropostaStatus = "PENDENTE" | "ACEITA" | "RECUSADA";

export type CriarPropostaPayload = {
  solicitacaoId: string;
  profissionalId: string;
  valor: string;
  prazoDias: number;
  mensagem: string;
};

export type PropostaResumo = {
  id: string;
  valor: string;
  prazoDias: number;
  mensagem: string;
  status: PropostaStatus;
  createdAt: string;
  updatedAt: string;
  solicitacao: {
    id: string;
    titulo: string;
    descricao: string;
    cliente: {
      id: string;
      nome: string;
      email: string;
    };
  };
  profissional: {
    id: string;
    nome: string;
    email: string;
  };
};
