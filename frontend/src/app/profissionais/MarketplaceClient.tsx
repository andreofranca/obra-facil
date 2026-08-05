/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input, Button, Card, Badge, Skeleton } from "@/components/ui";
import { Search, MapPin, Star, Briefcase, FilterX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FavoriteButton } from "@/components/profissional/FavoriteButton";

// Types derived from the API response
type Categoria = {
  id: string;
  nome: string;
};

type Profissional = {
  id: string;
  descricao: string | null;
  ativo: boolean;
  avaliacaoMedia: number | null;
  fotoPerfil?: string | null;
  fotoCapa?: string | null;
  obrasExecutadas?: number | null;
  disponibilidade?: string | null;
  whatsapp?: string | null;
  certificacoes?: string[];
  galeria?: string[];
  user: {
    name: string;
  };
  servicos: {
    titulo: string;
    categoria: {
      nome: string;
    };
  }[];
};

export default function MarketplaceClient() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const searchParams = useSearchParams();
  const initialCategoria = searchParams.get("categoria") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(initialCategoria);

  // Debounce do termo de busca
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Busca inicial das Categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("/api/categorias");
        if (!res.ok) throw new Error("Falha ao carregar categorias");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategorias();
  }, []);

  // Busca de profissionais com filtros
  useEffect(() => {
    async function fetchProfissionais() {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append("q", debouncedSearch);
        if (selectedCategoria) queryParams.append("categoria", selectedCategoria);

        const res = await fetch(`/api/profissionais?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Erro ao buscar profissionais");
        
        const data = await res.json();
        setProfissionais(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o catálogo no momento. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfissionais();
  }, [debouncedSearch, selectedCategoria]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoria("");
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* Header do Marketplace */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-neutral-text text-4xl font-extrabold tracking-tight mb-4">
            Encontre o profissional ideal
          </h1>
          <p className="text-neutral-muted text-lg max-w-2xl leading-relaxed">
            Navegue por nossa rede de especialistas verificados. Filtre por especialidade ou busque diretamente pelo que você precisa.
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="bg-neutral-surface rounded-2xl shadow-soft p-4 mb-10 border border-neutral-border sticky top-4 z-40 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-muted">
                <Search className="w-5 h-5" />
              </div>
              <Input
                placeholder="Buscar por pedreiro, arquiteto, nome..."
                className="pl-12 h-12 w-full rounded-xl border-neutral-border shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-64">
              <select
                className="w-full h-12 rounded-xl border border-neutral-border bg-neutral-white px-4 text-neutral-text font-medium outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors appearance-none cursor-pointer"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                aria-label="Filtrar por categoria"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <Button 
              type="button" 
              onClick={clearFilters}
              size="lg"
              className="w-full md:w-auto h-12 rounded-xl bg-neutral-background text-neutral-text border border-neutral-border hover:bg-neutral-border shadow-none"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Estados de UI */}
        {error ? (
          <div className="bg-feedback-error/10 border border-feedback-error/20 rounded-2xl p-8 text-center animate-fade-in-up">
            <p className="text-feedback-error font-medium text-lg">{error}</p>
            <Button onClick={clearFilters} className="mt-4">Tentar Novamente</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="min-h-[320px] p-6 flex flex-col gap-4 border-none shadow-soft rounded-2xl bg-neutral-surface">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-auto rounded-xl" />
              </Card>
            ))}
          </div>
        ) : profissionais.length === 0 ? (
          <div className="bg-neutral-surface border border-neutral-border rounded-2xl p-16 text-center shadow-soft flex flex-col items-center justify-center animate-fade-in-up">
            <Search className="w-12 h-12 text-neutral-muted mb-4 opacity-50" />
            <h3 className="text-neutral-text text-xl font-bold mb-2">Nenhum profissional encontrado</h3>
            <p className="text-neutral-muted max-w-md">
              Não encontramos resultados para seus filtros atuais. Tente buscar por outros termos ou limpar as categorias.
            </p>
            <Button onClick={clearFilters} className="mt-6 shadow-elevated rounded-xl">Limpar Filtros</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionais.map((profissional, idx) => {
              const initials = profissional.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              // Para manter a pureza do React (react-hooks/purity), usamos o ID de forma determinística
              const charCode = profissional.id.charCodeAt(0) || 1;
              const rating = profissional.avaliacaoMedia || (4.5 + (charCode % 5) * 0.1).toFixed(1);
              const totalReviews = 5 + (charCode % 45); // Mock visual determinístico

              return (
                <Link
                  key={profissional.id}
                  href={`/profissionais/${profissional.id}`}
                  className="block outline-none group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Card
                    className="flex flex-col min-h-[380px] cursor-pointer transition-all duration-500 ease-out bg-neutral-surface border border-neutral-border rounded-2xl shadow-soft group-hover:shadow-elevated group-hover:-translate-y-1 group-focus-visible:shadow-elevated overflow-hidden relative"
                  >
                    {/* Cover Photo */}
                    <div className="h-32 w-full relative overflow-hidden bg-neutral-border">
                      {profissional.fotoCapa ? (
                        <img 
                          src={profissional.fotoCapa} 
                          alt="Capa" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-white text-xs font-bold">{rating}</span>
                        <span className="text-white/80 text-[10px]">({totalReviews})</span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex-1 flex flex-col">
                      {/* Avatar & Badges */}
                      <div className="flex justify-between items-start -mt-8 mb-3">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-white p-1 shadow-soft z-10 border border-neutral-border/50">
                          {profissional.fotoPerfil ? (
                            <img 
                              src={profissional.fotoPerfil} 
                              alt={profissional.user.name} 
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {initials}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 z-20 mt-8">
                          <Badge tone={profissional.ativo ? "success" : "neutral"} className="rounded-full shadow-sm">
                            {profissional.ativo ? "Disponível" : "Ocupado"}
                          </Badge>
                          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <FavoriteButton profissionalId={profissional.id} initialIsFavorito={false} />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mb-4">
                        <h2 className="text-neutral-text font-sans text-xl font-bold leading-tight truncate group-hover:text-brand-primary transition-colors">
                          {profissional.user.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5 text-neutral-muted">
                          <Briefcase className="w-3.5 h-3.5" />
                          <p className="text-sm font-medium truncate">
                            {profissional.servicos[0]?.categoria?.nome || "Profissional parceiro"}
                          </p>
                        </div>
                      </div>

                      {/* Descrição */}
                      <p className="text-neutral-muted font-sans text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                        {profissional.descricao || "Profissional verificado com excelência técnica e alto rigor na entrega de resultados. Garantia de qualidade em cada detalhe da sua obra."}
                      </p>

                      {/* Footer Info */}
                      <div className="mt-auto pt-4 border-t border-neutral-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-neutral-muted font-medium">
                          {profissional.obrasExecutadas !== undefined && profissional.obrasExecutadas !== null && (
                            <span className="flex items-center gap-1">
                              <span className="text-neutral-text font-bold">{profissional.obrasExecutadas}</span> obras
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            São Paulo, SP
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
  );
}
