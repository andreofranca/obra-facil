import Link from "next/link";
import { Container, Logo } from "@/components/ui";

export function Footer() {
  return (
    <footer className="bg-neutral-white border-t border-neutral-border py-12 md:py-16 mt-auto">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm">
              <Logo />
            </Link>
            <p className="text-neutral-muted text-sm leading-relaxed max-w-xs">
              A maneira mais fácil e segura de encontrar profissionais de confiança para sua obra ou reforma.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-neutral-text mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Como funciona</Link></li>
              <li><Link href="/profissionais" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Encontrar Profissionais</Link></li>
              <li><Link href="/cadastro" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Seja um Profissional</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-neutral-text mb-4">Categorias</h3>
            <ul className="space-y-3">
              <li><Link href="/profissionais?categoria=Pedreiro" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Pedreiro</Link></li>
              <li><Link href="/profissionais?categoria=Eletricista" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Eletricista</Link></li>
              <li><Link href="/profissionais?categoria=Pintor" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Pintor</Link></li>
              <li><Link href="/profissionais?categoria=Encanador" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Encanador</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-neutral-text mb-4">Contato</h3>
            <ul className="space-y-3">
              <li><a href="mailto:contato@obrafacil.com" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">contato@obrafacil.com</a></li>
              <li><span className="text-neutral-muted text-sm">Segunda a Sexta, 9h às 18h</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-muted text-sm">
            &copy; {new Date().getFullYear()} ObraFácil. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/termos" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Termos</Link>
            <Link href="/privacidade" className="text-neutral-muted hover:text-brand-primary text-sm transition-colors">Privacidade</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
