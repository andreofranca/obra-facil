import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface RatingSummary {
  media: number;
  total: number;
  distribuicao: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export class RatingService {
  /**
   * Obtém a agregação de reputação de um profissional sob demanda.
   */
  static async getProfissionalReputation(profissionalId: string): Promise<RatingSummary> {
    const defaultDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    // Obter agregação total e média
    const aggregation = await prisma.avaliacaoServico.aggregate({
      where: { profissionalId },
      _avg: { nota: true },
      _count: { id: true }
    });

    const total = aggregation._count.id;
    const media = aggregation._avg.nota ? Number(aggregation._avg.nota.toFixed(1)) : 0;

    // Obter a distribuição (histograma) via groupBy
    const groupBy = await prisma.avaliacaoServico.groupBy({
      by: ['nota'],
      where: { profissionalId },
      _count: {
        id: true,
      },
    });

    const distribuicao = { ...defaultDistribution };
    for (const group of groupBy) {
      if (group.nota >= 1 && group.nota <= 5) {
        distribuicao[group.nota as keyof typeof distribuicao] = group._count.id;
      }
    }

    return {
      media,
      total,
      distribuicao
    };
  }

  /**
   * Valida regras de negócio de criação de avaliação
   */
  static validateRatingRules(nota: number) {
    if (nota < 1 || nota > 5) {
      throw new Error("A nota deve estar entre 1 e 5 estrelas.");
    }
    if (!Number.isInteger(nota)) {
      throw new Error("A nota deve ser um número inteiro.");
    }
  }
}
