import Link from "next/link";
import { Button } from "@/components/ui";
import { UserX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans">
            
      <main className="flex-1 w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] animate-fade-in-up">
          <div className="w-20 h-20 bg-feedback-error/10 text-feedback-error rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-white mb-3">Perfil não encontrado</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
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

          </div>
  );
}
