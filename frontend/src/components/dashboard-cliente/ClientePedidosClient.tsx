"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Star, MapPin, ChevronRight, Clock, 
  Heart, Award, Sparkles,
  ThumbsUp, ShieldCheck, Zap, AlertCircle, CheckCircle
} from 'lucide-react';

interface ClientePedidosClientProps {
  user: { name: string } | null;
  categorias: { id: string; nome: string }[];
  prosDestaque: { id: string; fotoPerfil?: string | null; avaliacaoMedia?: number | null; obrasExecutadas?: number | null; endereco?: { cidade: string | null } | null; user: { name: string }; servicos?: { categoria: { nome: string } }[] }[];
  favoritos: { id: string; profissionalId: string; profissional: { fotoPerfil?: string | null; user: { name: string } } }[];
  avaliacoes: { id: string; nota: number; comentario?: string | null; createdAt: Date | string; profissional: { user: { name: string } | null } | null }[];
  solicitacoes: { id: string; titulo: string; createdAt: Date | string; status: string }[];
}

export function ClientePedidosClient({ 
  user, 
  categorias, 
  prosDestaque, 
  favoritos, 
  avaliacoes, 
  solicitacoes 
}: ClientePedidosClientProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular loading elegante
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="h-32 bg-slate-800 rounded-3xl animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-20 bg-slate-800 rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="h-40 bg-slate-800 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-24 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header - Boas-Vindas */}
        <header className="pt-12 pb-8 px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Olá, {user?.name}! <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-lg">O que deseja fazer hoje?</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-14 h-14 rounded-full border-2 border-slate-800 bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Search Bar - Glassmorphism */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-slate-800/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all"
              placeholder="Buscar pedreiro, encanador, eletricista..."
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
               <Link href="/profissionais" className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl transition-colors">
                 <ChevronRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </header>

        <main className="px-6 space-y-12">
          
          {/* Categorias */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Categorias Principais
              </h2>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {categorias?.map((cat: Record<string, string>, index: number) => {
                const colors = ['from-amber-400 to-orange-500', 'from-blue-400 to-indigo-500', 'from-yellow-400 to-amber-500', 'from-cyan-400 to-blue-500', 'from-emerald-400 to-green-500', 'from-lime-400 to-green-500', 'from-purple-400 to-fuchsia-500', 'from-gray-700 to-gray-900'];
                const color = colors[index % colors.length];
                return (
                  <Link href={`/profissionais?categoria=${cat.nome}`} key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} p-[1px] shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1`}>
                      <div className="w-full h-full bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl group-hover:bg-transparent transition-colors duration-300 text-white">
                        {cat.nome.substring(0,2).toUpperCase()}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors text-center line-clamp-1">{cat.nome}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Profissionais em Destaque */}
          {prosDestaque && prosDestaque.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Profissionais em Destaque
                </h2>
                <Link href="/profissionais" className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Ver todos</Link>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-6 px-6">
                {prosDestaque.map((pro) => (
                  <Link href={`/profissionais/${pro.id}`} key={pro.id} className="min-w-[280px] bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 snap-start group cursor-pointer relative overflow-hidden block">
                    <div className="flex gap-4 items-center mb-4 relative z-10">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative w-16 h-16 rounded-full border-2 border-slate-700 bg-indigo-900 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                          {pro.fotoPerfil ? <img src={pro.fotoPerfil} className="w-full h-full object-cover" /> : pro.user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-800"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-lg leading-tight group-hover:text-indigo-400 transition-colors">{pro.user.name}</h3>
                        <p className="text-sm text-indigo-300 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {pro.servicos?.[0]?.categoria?.nome || 'Profissional parceiro'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-900/50 rounded-xl p-2 flex flex-col justify-center items-center">
                        <div className="flex items-center text-amber-400 font-bold">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {pro.avaliacaoMedia || '4.5'}
                        </div>
                        <span className="text-[10px] text-slate-400">({pro.obrasExecutadas || 0} avaliações)</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-2 flex flex-col justify-center items-center">
                        <span className="text-slate-200 font-bold">{pro.obrasExecutadas || 0}</span>
                        <span className="text-[10px] text-slate-400">obras</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/30 rounded-xl p-3 border border-slate-700/30">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-indigo-400" />
                        {pro.endereco?.cidade || 'Local não inf.'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Favoritos */}
             <div className="space-y-8">
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-bold text-white">Favoritos</h2>
                 </div>
                 {favoritos && favoritos.length > 0 ? (
                   <div className="flex gap-3 overflow-x-auto pb-4">
                     {favoritos.map((fav) => (
                       <Link href={`/profissionais/${fav.profissionalId}`} key={fav.id} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
                         <div className="w-14 h-14 rounded-full border-2 border-slate-700 group-hover:border-red-400 transition-colors bg-indigo-900 flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                           {fav.profissional.fotoPerfil ? <img src={fav.profissional.fotoPerfil} className="w-full h-full object-cover" /> : fav.profissional.user.name.charAt(0)}
                         </div>
                         <span className="text-xs text-slate-300 text-center line-clamp-1 w-16">{fav.profissional.user.name}</span>
                       </Link>
                     ))}
                     <Link href="/profissionais" className="w-14 h-14 flex-shrink-0 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-colors">
                       <Search className="w-5 h-5" />
                     </Link>
                   </div>
                 ) : (
                   <div className="text-slate-400 text-sm italic bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                     Você ainda não tem profissionais favoritos.
                   </div>
                 )}
               </section>
             </div>
          </div>

          {/* Serviços Recentes (OrdersList) */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Solicitações Recentes
              </h2>
              <Link href="/minhas-solicitacoes" className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors flex items-center">
                Ver todas <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-2 dark-mode-orders-list">
                 <OrdersListDark solicitacoes={solicitacoes} />
              </div>
            </div>
          </section>

          {/* Avaliações Recentes */}
          {avaliacoes && avaliacoes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Suas Avaliações</h2>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 shadow-lg relative">
                <div className="absolute top-0 right-0 text-9xl text-slate-700/10 font-serif leading-none select-none">&quot;</div>
                {avaliacoes.map((av) => (
                  <div key={av.id} className="relative z-10 mb-6 last:mb-0 border-b border-slate-700/50 last:border-0 pb-6 last:pb-0">
                     <div className="flex items-center gap-1 mb-2 text-amber-400">
                       {[...Array(av.nota)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                     </div>
                     <p className="text-slate-300 italic mb-4">&quot;{av.comentario || 'Sem comentário'}&quot;</p>
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">Para <strong className="text-slate-200">{av.profissional?.user?.name || 'Profissional apagado'}</strong></span>
                       <span className="text-slate-500 text-xs">{new Date(av.createdAt).toLocaleDateString('pt-BR')}</span>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function OrdersListDark({ solicitacoes }: { solicitacoes: { id: string; titulo: string; createdAt: Date | string; status: string }[] }) {
  if (!solicitacoes || solicitacoes.length === 0) {
    return <div className="p-6 text-slate-400 text-center">Nenhuma solicitação encontrada.</div>;
  }

  return (
    <div className="divide-y divide-slate-700/50">
      {solicitacoes.map((order) => {
        let Icon = Clock;
        let color = 'text-amber-400';
        let bg = 'bg-amber-400/10 border-amber-400/20';

        if (order.status === 'CONCLUIDA' || order.status === 'FINALIZADA') {
          Icon = CheckCircle;
          color = 'text-emerald-400';
          bg = 'bg-emerald-400/10 border-emerald-400/20';
        } else if (order.status === 'CANCELADA' || order.status === 'RECUSADA' || order.status === 'EXPIRADA') {
          Icon = AlertCircle;
          color = 'text-red-400';
          bg = 'bg-red-400/10 border-red-400/20';
        } else if (order.status === 'EM_EXECUCAO') {
          Icon = Zap;
          color = 'text-indigo-400';
          bg = 'bg-indigo-400/10 border-indigo-400/20';
        }

        return (
          <Link href={`/minhas-solicitacoes/${order.id}`} key={order.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between cursor-pointer rounded-xl m-1 block">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${bg} ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">{order.titulo}</h4>
                <div className="text-sm text-slate-400 flex items-center gap-2 mt-1 font-medium">
                  <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className={color}>{order.status}</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
