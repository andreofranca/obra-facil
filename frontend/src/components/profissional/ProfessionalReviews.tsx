import { PrismaClient } from "@prisma/client";
import { RatingService } from "@/domain/RatingService";
import { ReviewSummary, ReviewList } from "@/components/reviews";

const prisma = new PrismaClient();

export async function ProfessionalReviews({ profissionalId }: { profissionalId: string }) {
  const summary = await RatingService.getProfissionalReputation(profissionalId);
  
  const avaliacoesData = await prisma.avaliacaoServico.findMany({
    where: { profissionalId },
    include: {
      cliente: {
        include: {
          user: true
        }
      },
      solicitacao: true
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const avaliacoes = avaliacoesData.map(a => ({
    id: a.id,
    nota: a.nota,
    comentario: a.comentario,
    createdAt: a.createdAt.toISOString(),
    cliente: {
      nome: a.cliente.user.name,
    },
    solicitacao: {
      titulo: a.solicitacao.titulo,
    }
  }));

  return (
    <section className="mt-12" id="avaliacoes">
      <h2 className="text-2xl font-bold text-neutral-dark mb-6">Avaliações</h2>
      <div className="flex flex-col gap-8">
        <ReviewSummary summary={summary} />
        <div>
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Últimas avaliações</h3>
          <ReviewList avaliacoes={avaliacoes} />
        </div>
      </div>
    </section>
  );
}
