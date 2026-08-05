"use client";

import Link from "next/link";
import { Button, Container, Logo } from "@/components/ui";
import { useEffect, useState } from "react";

export function Header() {
  const [session, setSession] = useState<{ role?: string; [key: string]: unknown } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.ok ? res.json() : null)
      .then(data => setSession(data))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-border bg-white/80 backdrop-blur-xl shadow-soft">
      <Container size="xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link href="/" className="outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm block">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-4 border-l border-neutral-border pl-6">
              <Link href="/" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                Home
              </Link>
              
              {session?.role === "CLIENT" && (
                <>
                  <Link href="/profissionais" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Marketplace
                  </Link>
                  <Link href="/meus-pedidos" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Meus Pedidos
                  </Link>
                  <Link href="/favoritos" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Favoritos
                  </Link>
                  <Link href="/perfil" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Perfil
                  </Link>
                </>
              )}

              {session?.role === "PROFESSIONAL" && (
                <>
                  <Link href="/profissional/dashboard" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profissional/pedidos" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Pedidos
                  </Link>
                  <Link href="/profissional/agenda" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Agenda
                  </Link>
                  <Link href="/profissional/perfil" className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors">
                    Perfil
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" size="sm" className="hidden sm:inline-flex rounded-full">
                  Sair
                </Button>
              </form>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm px-2 py-1"
                >
                  Entrar
                </Link>
                <Link href="/cadastro" className="outline-none" tabIndex={-1}>
                  <Button size="sm" className="hidden sm:inline-flex rounded-full shadow-md hover:shadow-lg transition-all">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
