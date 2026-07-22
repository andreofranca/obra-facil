import { Button, Logo } from "@/components/ui";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-wrap items-center justify-between gap-10 md:gap-12 min-h-[calc(100vh-128px)] py-10 md:py-[72px]"
    >
      <div className="flex-1 w-full lg:w-auto min-w-[280px] lg:min-w-[440px] max-w-[600px] flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-medium text-xs sm:text-sm w-fit transition-colors hover:bg-brand-primary/10">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          A melhor plataforma de obras
        </div>

        <Logo />
        
        <h1
          id="hero-title"
          className="text-neutral-text font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mt-6 mb-0"
        >
          Encontre profissionais de <span className="text-brand-secondary">confiança</span> para sua obra.
        </h1>
        <p className="text-neutral-muted font-sans text-lg md:text-xl leading-relaxed mt-4 md:mt-6 mb-8 max-w-[520px]">
          Solicite serviços, receba propostas e escolha o talento ideal para sua necessidade em poucos minutos.
        </p>

        <form
          action="/profissionais"
          method="GET"
          role="search"
          className="flex items-center bg-neutral-white border border-neutral-border rounded-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 p-2 max-w-[500px]"
        >
          <div className="flex-1 px-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-muted">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              name="q"
              aria-label="Qual serviço você procura?"
              placeholder="Ex: Pedreiro, Eletricista, Pintor..."
              className="w-full bg-transparent border-none outline-none text-neutral-text placeholder:text-neutral-muted font-sans text-base"
            />
          </div>
          <Button type="submit" size="md" className="rounded-full px-6 min-h-[44px]">
            Buscar
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 md:mt-10 w-full sm:w-auto">
          <Button size="lg" className="rounded-full w-full sm:w-auto">Solicitar Serviço</Button>
          <Button size="lg" variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
            Sou Profissional
          </Button>
        </div>
      </div>

      <div
        aria-label="Ilustração do ambiente de obra"
        className="relative flex items-center justify-center flex-1 w-full lg:w-auto min-w-[280px] lg:min-w-[460px] min-h-[400px] md:min-h-[460px] rounded-3xl overflow-hidden mt-8 md:mt-0"
      >
        {/* Background Gradients em vez de cor sólida */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/5" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-secondary/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-[60px]" />

        {/* Abstract Glassmorphism Card */}
        <div className="relative z-10 w-[90%] max-w-[360px] bg-neutral-white/70 backdrop-blur-md border border-neutral-white/50 rounded-2xl p-5 md:p-6 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-brand-secondary rounded-2xl flex items-center justify-center text-neutral-white shadow-lg shadow-brand-secondary/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="text-neutral-text font-bold text-lg leading-tight m-0">Profissional Local</p>
              <p className="text-neutral-muted text-sm m-0 flex items-center gap-1 mt-1">
                <span className="text-brand-accent">★ 5.0</span> (120 avaliações)
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-2 w-full bg-neutral-border/50 rounded-full overflow-hidden">
               <div className="h-full w-[80%] bg-brand-secondary rounded-full" />
            </div>
            <div className="flex justify-between text-xs font-semibold text-neutral-muted">
              <span>Disponibilidade</span>
              <span className="text-brand-secondary">Imediata</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-border/40 flex justify-between items-center">
            <p className="text-sm font-medium text-neutral-muted m-0">Taxa de Resposta</p>
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary font-bold text-xs rounded-full">100%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
