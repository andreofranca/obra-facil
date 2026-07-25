import { Header, Footer } from "@/components/layout";
import { ServiceWizard } from "@/components/solicitacao";
import { Wrench } from "lucide-react";

export default function SolicitarServicoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 w-full flex items-center justify-center py-10 px-4 md:px-8 bg-gradient-to-b from-neutral-background to-neutral-surface">
        <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
          
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-text mb-3 tracking-tight">
              Solicitar Serviço
            </h1>
            <p className="text-neutral-muted text-lg max-w-lg mx-auto leading-relaxed">
              Responda algumas perguntas rápidas para que o profissional entenda exatamente o que você precisa.
            </p>
          </div>

          <ServiceWizard />
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
