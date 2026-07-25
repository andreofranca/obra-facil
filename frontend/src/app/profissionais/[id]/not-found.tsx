import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { UserX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-surface border border-neutral-border rounded-3xl p-10 text-center shadow-soft animate-fade-in-up">
          <div className="w-20 h-20 bg-feedback-error/10 text-feedback-error rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-neutral-text mb-3">Perfil não encontrado</h1>
          <p className="text-neutral-muted mb-8 leading-relaxed">
            O profissional que você está procurando não existe, foi removido da plataforma ou o link está incorreto.
          </p>
          
          <Link href="/profissionais" className="block w-full outline-none">
            <Button size="lg" className="w-full rounded-xl shadow-elevated">
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o catálogo
              </span>
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
