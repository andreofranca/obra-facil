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
  endereco?: {
    cidade: string | null;
    estado: string | null;
  } | null;
  avaliacoesServico?: { nota: number }[];
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
        setProfissionais(Array.isArray(data) ? data : (data.items || []));
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
    <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full min-h-screen relative overflow-hidden text-slate-200 font-sans">
      
      <div className="relative z-10">
        {/* Header do Marketplace */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mb-4">
            Catálogo de Profissionais
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Busque especialistas, verifique avaliações e contrate profissionais qualificados para sua obra.
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 mb-10 border border-slate-700/50 sticky top-4 z-40 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <Input
                placeholder="Buscar por pedreiro, arquiteto, nome..."
                className="pl-12 h-12 w-full rounded-xl border-slate-700 bg-slate-900/50 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 shadow-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-64">
              <select
                className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-white font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
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
              className="w-full md:w-auto h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-none"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Estados de UI */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center animate-fade-in-up">
            <p className="text-red-400 font-medium text-lg">{error}</p>
            <Button onClick={clearFilters} className="mt-4 bg-slate-800 hover:bg-slate-700 text-white border-slate-700">Tentar Novamente</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="min-h-[320px] p-6 flex flex-col gap-4 border border-slate-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl bg-slate-800/50 backdrop-blur-xl">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-16 h-16 rounded-full bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-slate-700" />
                    <Skeleton className="h-4 w-1/2 bg-slate-700" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4 bg-slate-700" />
                <Skeleton className="h-4 w-5/6 bg-slate-700" />
                <Skeleton className="h-10 w-full mt-auto rounded-xl bg-slate-700" />
              </Card>
            ))}
          </div>
        ) : profissionais.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-16 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center animate-fade-in-up">
            <Search className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
            <h3 className="text-white text-xl font-bold mb-2">Nenhum profissional encontrado</h3>
            <p className="text-slate-400 max-w-md">
              Não encontramos resultados para seus filtros atuais. Tente buscar por outros termos ou limpar as categorias.
            </p>
            <Button onClick={clearFilters} className="mt-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">Limpar Filtros</Button>
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

              let reviewsCount = 0;
              let rating = 0;
              if (profissional.avaliacoesServico && profissional.avaliacoesServico.length > 0) {
                reviewsCount = profissional.avaliacoesServico.length;
                rating = Math.round(
                  profissional.avaliacoesServico.reduce((acc, curr) => acc + curr.nota, 0) / reviewsCount
                );
              }
              const displayRating = reviewsCount > 0 ? rating.toFixed(1) : "Novo";
              const displayTotal = reviewsCount > 0 ? `(${reviewsCount})` : "";
              const cidade = profissional.endereco?.cidade || "Local";
              const estado = profissional.endereco?.estado || "não informado";

              return (
                <Link
                  key={profissional.id}
                  href={`/profissionais/${profissional.id}`}
                  className="block outline-none group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Card
                    className="flex flex-col min-h-[380px] cursor-pointer transition-all duration-500 ease-out bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] group-hover:-translate-y-1 overflow-hidden relative"
                  >
                    {/* Cover Photo */}
                    <div className="h-32 w-full relative overflow-hidden bg-slate-800">
                      {profissional.fotoCapa ? (
                        <img 
                          src={profissional.fotoCapa} 
                          alt="Capa" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-bold">{displayRating}</span>
                        <span className="text-white/80 text-[10px]">{displayTotal}</span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex-1 flex flex-col">
                      {/* Avatar & Badges */}
                      <div className="flex justify-between items-start -mt-8 mb-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 p-1 z-10 border border-slate-700/50">
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
                        <h2 className="text-white font-sans text-xl font-bold leading-tight truncate group-hover:text-brand-primary transition-colors">
                          {profissional.user.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                          <Briefcase className="w-3.5 h-3.5" />
                          <p className="text-sm font-medium truncate">
                            {profissional.servicos[0]?.categoria?.nome || "Profissional parceiro"}
                          </p>
                        </div>
                      </div>

                      {/* Descrição */}
                      <p className="text-slate-400 font-sans text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                        {profissional.descricao || "Profissional verificado com excelência técnica e alto rigor na entrega de resultados. Garantia de qualidade em cada detalhe da sua obra."}
                      </p>

                      {/* Footer Info */}
                      <div className="mt-auto pt-4 border-t border-slate-700/50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                          {profissional.obrasExecutadas !== undefined && profissional.obrasExecutadas !== null && (
                            <span className="flex items-center gap-1">
                              <span className="text-white font-bold">{profissional.obrasExecutadas}</span> obras
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {cidade}{estado ? `, ${estado}` : ''}
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
    </div>
  );
}
