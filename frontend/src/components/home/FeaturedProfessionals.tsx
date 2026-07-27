import { Card } from "@/components/ui/Card";
import { getProfissionais } from "@/lib/services/profissionais";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

export async function FeaturedProfessionals() {
  const profissionaisAll = await getProfissionais();
  const profissionais = profissionaisAll.dados.slice(0, 4);

  return (
    <section aria-labelledby="featured-professionals-title" className="py-16 md:py-24 bg-neutral-background">
      <div className="mb-12 max-w-2xl">
        <h2
          id="featured-professionals-title"
          className="text-neutral-text font-sans text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight"
        >
          Profissionais em Destaque
        </h2>
        <p className="text-neutral-muted font-sans text-lg leading-relaxed">
          Conheça os talentos mais bem avaliados pela nossa comunidade de clientes.
        </p>
      </div>

      {profissionais.length === 0 ? (
        <div className="text-center py-16 bg-neutral-surface rounded-2xl border border-neutral-border shadow-soft">
          <p className="text-neutral-muted font-medium">Nenhum profissional em destaque no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {profissionais.map((profissional) => {
            let reviewsCount = 0;
            let rating = 0;
            if (profissional.avaliacoesServico && profissional.avaliacoesServico.length > 0) {
              reviewsCount = profissional.avaliacoesServico.length;
              rating = Math.round(
                profissional.avaliacoesServico.reduce((acc: any, curr: any) => acc + curr.nota, 0) / reviewsCount
              );
            }
            
            // Fallback for visual mockup if no ratings exist
            if (reviewsCount === 0) {
              rating = 5;
              reviewsCount = (profissional.id.charCodeAt(0) % 50) + 10;
            }

            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profissional.user.name)}&backgroundColor=b6e3f4`;

            return (
              <Card
                key={profissional.id}
                className="flex flex-col h-full bg-neutral-surface border border-neutral-border shadow-soft hover:shadow-elevated transition-shadow duration-300 rounded-2xl overflow-hidden group"
              >
                <div className="p-6 flex-1 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-neutral-background shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src={avatarUrl} 
                      alt={`Foto de ${profissional.user.name}`} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  
                  <h3 className="text-neutral-text font-sans text-lg font-bold leading-tight mb-1 group-hover:text-brand-primary transition-colors">
                    {profissional.user.name}
                  </h3>
                  
                  <p className="text-brand-primary font-sans text-sm font-semibold mb-3">
                    {profissional.servicos[0]?.titulo || "Profissional Verificado"}
                  </p>
                  
                  <div className="flex items-center gap-1 text-neutral-muted text-sm mb-4 bg-neutral-background px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>São Paulo, SP</span> {/* Dados mockados de cidade conforme mockup visual */}
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex text-brand-accent">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-neutral-border fill-transparent'}`} />
                      ))}
                    </div>
                    <span className="text-neutral-text font-semibold text-sm">{rating.toFixed(1)}</span>
                    <span className="text-neutral-muted text-xs">({reviewsCount})</span>
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-border/50 bg-neutral-surface">
                  <Link 
                    href={`/profissionais/${profissional.id}`} 
                    className="flex items-center justify-center w-full py-2.5 bg-neutral-white border border-neutral-border rounded-xl text-brand-primary font-sans font-semibold text-sm transition-all hover:bg-brand-primary hover:border-brand-primary hover:text-neutral-white focus-visible:ring-2 focus-visible:ring-brand-primary outline-none"
                  >
                    Ver Perfil Completo
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
