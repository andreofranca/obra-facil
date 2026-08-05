import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-9xl font-black text-brand-primary/20">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-text">Página não encontrada</h2>
            <p className="text-neutral-text/70">
              A página que você está procurando pode ter sido removida, mudou de nome, ou está temporariamente indisponível.
            </p>
          </div>
          <Link href="/" tabIndex={-1}>
            <Button size="lg" className="w-full sm:w-auto">
              Voltar para a página inicial
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
