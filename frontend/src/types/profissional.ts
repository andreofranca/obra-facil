import type { CategoriaServicoResumo } from "./categoria";

export type ProfissionalResumo = {
  id: string;
  descricao: string | null;
  experiencia: number | null;
  ativo: boolean;
  fotoPerfil?: string | null;
  fotoCapa?: string | null;
  obrasExecutadas?: number | null;
  disponibilidade?: string | null;
  whatsapp?: string | null;
  certificacoes?: string[];
  galeria?: string[];
  user: {
    id?: string;
    name: string;
    email?: string;
    phone?: string | null;
  };
  endereco?: {
    cidade: string | null;
    estado: string | null;
  } | null;
  servicos: {
    id: string;
    titulo: string;
    descricao: string | null;
    categoria: CategoriaServicoResumo;
  }[];
  avaliacoesServico?: {
    nota: number;
  }[];
};

