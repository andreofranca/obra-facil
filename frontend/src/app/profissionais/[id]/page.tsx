import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  ProfessionalHero,
  ProfessionalInfo,
  ProfessionalServices,
  ProfessionalSidebar,
  ProfessionalCTA,
  ProfessionalReviews
} from "@/components/profissional";
import type { ProfissionalResumo } from "@/types/profissional";
import { getAuthSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SSR data fetch
async function getProfissional(id: string): Promise<ProfissionalResumo | null> {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${url}/api/profissionais?id=${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function ProfissionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profissional = await getProfissional(id);

  if (!profissional) {
    notFound();
  }

  // Derived determinist mock data for UI visual constraints
  const principalServico = profissional.servicos[0];
  const especialidade = principalServico?.categoria.nome || "Especialista Parceiro";
  
  const session = await getAuthSession();
  let isFavorito = false;
  if (session?.role === "CLIENT" && session.clienteId) {
    const fav = await prisma.favorito.findFirst({
      where: {
        clienteId: session.clienteId,
        profissionalId: profissional.id,
      },
    });
    isFavorito = !!fav;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 w-full pb-16">
        <ProfessionalHero 
          name={profissional.user.name} 
          specialty={especialidade}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Coluna Principal: Conteúdo do Profissional */}
          <div className="lg:col-span-2 space-y-12">
            <ProfessionalInfo 
              description={profissional.descricao} 
              experience={profissional.experiencia}
              categoryName={especialidade}
            />
            
            <ProfessionalServices services={profissional.servicos} />
            
            <ProfessionalCTA profissionalId={profissional.id} />

            <ProfessionalReviews profissionalId={profissional.id} />
          </div>

          {/* Coluna Lateral: Dados rápidos e CTA */}
          <aside className="lg:col-span-1">
            <ProfessionalSidebar 
              profissionalId={profissional.id} 
              ativo={profissional.ativo} 
              isFavorito={isFavorito}
            />
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
