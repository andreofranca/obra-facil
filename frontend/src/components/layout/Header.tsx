import Link from "next/link";
import { Button, Container, Logo } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-border bg-neutral-surface/80 backdrop-blur-md">
      <Container size="xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm block">
              <Logo />
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm px-2 py-1"
            >
              Entrar
            </Link>
            <Link href="/cadastro" className="outline-none" tabIndex={-1}>
              <Button size="sm" className="hidden sm:inline-flex rounded-full">
                Cadastrar
              </Button>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
