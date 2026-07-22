import type { CategoriaServicoResumo } from "./categoria";

export type ProfissionalResumo = {
  id: string;
  descricao: string | null;
  experiencia: number | null;
  ativo: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  servicos: {
    id: string;
    titulo: string;
    descricao: string | null;
    categoria: CategoriaServicoResumo;
  }[];
  avaliacoes?: {
    nota: number;
  }[];
};

