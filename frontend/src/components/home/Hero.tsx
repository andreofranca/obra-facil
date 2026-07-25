import Image from "next/image";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[calc(100vh-160px)] py-12 md:py-20"
    >
      <div className="flex-1 w-full flex flex-col justify-center max-w-2xl animate-fade-in-up">
        <h1
          id="hero-title"
          className="text-neutral-text font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
        >
          Encontre o profissional ideal para sua <span className="text-brand-primary">obra ou reforma.</span>
        </h1>
        <p className="text-neutral-muted font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
          Conectamos você aos melhores pedreiros, pintores, encanadores e eletricistas da sua região. Rápido, seguro e sem complicações.
        </p>

        <form
          action="/profissionais"
          method="GET"
          role="search"
          className="flex flex-col sm:flex-row items-center bg-neutral-white border border-neutral-border rounded-2xl sm:rounded-full shadow-elevated p-2 max-w-xl w-full focus-within:ring-2 focus-within:ring-brand-primary/50 transition-all duration-300"
        >
          <div className="flex-1 px-4 py-3 sm:py-0 flex items-center gap-3 w-full border-b sm:border-b-0 border-neutral-border mb-2 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary shrink-0">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              name="q"
              aria-label="O que você precisa?"
              placeholder="Ex: Pedreiro, Eletricista, Pintor..."
              className="w-full bg-transparent border-none outline-none text-neutral-text placeholder:text-neutral-muted font-sans text-base"
            />
          </div>
          <Button type="submit" size="lg" className="rounded-xl sm:rounded-full w-full sm:w-auto px-8 py-3 h-auto sm:h-12 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            Encontrar profissionais
          </Button>
        </form>
      </div>

      <div
        aria-label="Ilustração de profissionais de construção civil"
        className="relative flex-1 w-full max-w-2xl lg:max-w-none flex justify-center lg:justify-end"
      >
        <div className="relative w-full aspect-square max-w-[540px] rounded-3xl overflow-hidden shadow-elevated group">
          <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <Image
            src="/images/hero.jpg"
            alt="Profissionais qualificados sorrindo: um eletricista, um encanador, um pedreiro e um pintor."
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 540px"
          />
        </div>
      </div>
    </section>
  );
}
