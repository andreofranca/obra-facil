/* eslint-disable */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Star, MapPin, ChevronRight, Clock, Calendar, 
  Heart, Tag, Award, Sparkles, TrendingUp, History,
  ThumbsUp, ShieldCheck, Zap
} from 'lucide-react';
import { OrdersList } from '@/components/client-dashboard/OrdersList';

// Mock Data
const MOCK_USER = { name: "André" };

const CATEGORIES = [
  { id: '1', name: 'Pedreiro', icon: '🧱', color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/30' },
  { id: '2', name: 'Pintor', icon: '🎨', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-indigo-500/30' },
  { id: '3', name: 'Eletricista', icon: '⚡', color: 'from-yellow-400 to-amber-500', shadow: 'shadow-amber-500/30' },
  { id: '4', name: 'Encanador', icon: '🔧', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-blue-500/30' },
  { id: '5', name: 'Limpeza', icon: '🧹', color: 'from-emerald-400 to-green-500', shadow: 'shadow-green-500/30' },
  { id: '6', name: 'Jardinagem', icon: '🌱', color: 'from-lime-400 to-green-500', shadow: 'shadow-green-500/30' },
  { id: '7', name: 'Montador', icon: '🪑', color: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-500/30' },
  { id: '8', name: 'Mais', icon: 'grid', isIcon: true, color: 'from-gray-700 to-gray-900', shadow: 'shadow-gray-500/30' },
];

const PROS_DESTAQUE = [
  { id: 'p1', name: 'Carlos Roberto', role: 'Eletricista Premium', rating: 4.9, reviews: 124, price: 'R$ 80/h', city: 'São Paulo', availability: 'Hoje', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 'p2', name: 'Ana Silva', role: 'Pintora', rating: 4.8, reviews: 89, price: 'R$ 65/h', city: 'São Paulo', availability: 'Amanhã', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: 'p3', name: 'Roberto Carlos', role: 'Encanador', rating: 4.7, reviews: 201, price: 'R$ 70/h', city: 'Osasco', availability: 'Em 2 dias', avatar: 'https://i.pravatar.cc/150?u=roberto' },
];

const RECOMENDADOS = [
  { id: 'r1', name: 'Limpeza Pós-Obra', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop', category: 'Limpeza' },
  { id: 'r2', name: 'Instalação de Ar Condicionado', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=200&fit=crop', category: 'Climatização' },
  { id: 'r3', name: 'Pintura Decorativa', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop', category: 'Pintura' },
];

const FAVORITOS = [
  { id: 'f1', name: 'Marcos (Pedreiro)', avatar: 'https://i.pravatar.cc/150?u=marcos' },
  { id: 'f2', name: 'Juliana (Limpeza)', avatar: 'https://i.pravatar.cc/150?u=juliana' },
];

const ULTIMOS_ACESSADOS = [
  { id: 'ua1', name: 'Reparo de Telhado', time: 'Há 2 horas' },
  { id: 'ua2', name: 'Instalação Elétrica', time: 'Ontem' },
];

const PROMOCOES = [
  { id: 'prom1', title: '15% OFF em Pintura', desc: 'Valido até Sexta', code: 'PINTA15', bg: 'from-pink-500 to-rose-500' },
  { id: 'prom2', title: 'Limpeza Completa', desc: 'Ganhe Higienização', code: 'LIMPA+', bg: 'from-violet-500 to-purple-600' },
];

const AVALIACOES_RECENTES = [
  { id: 'av1', author: 'Você', pro: 'Carlos Roberto', rating: 5, comment: 'Excelente trabalho, muito rápido e limpo!', date: 'Há 1 semana' },
];

export function ClientePedidosClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular loading elegante
    const timer = setTimeout(() => setLoading(false), 800);
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
                Olá, {MOCK_USER.name}! <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-lg">O que deseja fazer hoje?</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <img src="https://i.pravatar.cc/150?u=andre" alt="User" className="relative w-14 h-14 rounded-full border-2 border-slate-800 object-cover" />
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
               <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl transition-colors">
                 <ChevronRight className="w-5 h-5" />
               </button>
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
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} p-[1px] ${cat.shadow} hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1`}>
                    <div className="w-full h-full bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl group-hover:bg-transparent transition-colors duration-300">
                      {cat.isIcon ? <div className="text-white"><Zap className="w-6 h-6"/></div> : cat.icon}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors text-center">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Promoções & Banners (Premium Cards) */}
          <section className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
             {PROMOCOES.map(promo => (
               <div key={promo.id} className={`min-w-[280px] sm:min-w-[320px] rounded-3xl p-6 bg-gradient-to-r ${promo.bg} shadow-lg relative overflow-hidden snap-start group cursor-pointer`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                   <Tag className="w-6 h-6 text-white/80 mb-2" />
                   <h3 className="text-xl font-bold text-white mb-1">{promo.title}</h3>
                   <p className="text-white/80 text-sm mb-4">{promo.desc}</p>
                   <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-sm border border-white/20">
                     {promo.code}
                   </div>
                 </div>
               </div>
             ))}
          </section>

          {/* Profissionais em Destaque */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Profissionais em Destaque
              </h2>
              <button className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Ver todos</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 snap-x hide-scrollbar -mx-6 px-6">
              {PROS_DESTAQUE.map((pro) => (
                <div key={pro.id} className="min-w-[280px] bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 snap-start group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-md p-2 rounded-full z-10 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4 text-slate-400 group-hover/heart:text-red-400" />
                  </div>
                  <div className="flex gap-4 items-center mb-4 relative z-10">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <img src={pro.avatar} alt={pro.name} className="relative w-16 h-16 rounded-full object-cover border-2 border-slate-700" />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg leading-tight group-hover:text-indigo-400 transition-colors">{pro.name}</h3>
                      <p className="text-sm text-indigo-300 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {pro.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded-xl p-2 flex flex-col justify-center items-center">
                       <div className="flex items-center text-amber-400 font-bold">
                         <Star className="w-4 h-4 fill-current mr-1" />
                         {pro.rating}
                       </div>
                       <span className="text-[10px] text-slate-400">({pro.reviews} avaliações)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2 flex flex-col justify-center items-center">
                       <span className="text-slate-200 font-bold">{pro.price}</span>
                       <span className="text-[10px] text-slate-400">Valor estimado</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/30 rounded-xl p-3 border border-slate-700/30">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-indigo-400" />
                      {pro.city}
                    </div>
                    <div className="flex items-center text-emerald-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {pro.availability}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grid: Recomendados & Favoritos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Recomendados */}
             <section>
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                  <h2 className="text-xl font-bold text-white">Sugeridos para você</h2>
                </div>
                <div className="space-y-4">
                  {RECOMENDADOS.map(rec => (
                    <div key={rec.id} className="group relative rounded-2xl overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                      <img src={rec.image} alt={rec.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <span className="px-2 py-1 bg-indigo-500/80 backdrop-blur-sm text-[10px] font-bold uppercase rounded-md text-white mb-2 inline-block tracking-wider">
                          {rec.category}
                        </span>
                        <h3 className="text-white font-bold">{rec.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
             </section>

             {/* Outros (Favoritos, Últimos Acessos) */}
             <div className="space-y-8">
               {/* Profissionais Favoritos */}
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-bold text-white">Favoritos</h2>
                 </div>
                 <div className="flex gap-3">
                   {FAVORITOS.map(fav => (
                     <div key={fav.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                       <img src={fav.avatar} className="w-14 h-14 rounded-full border-2 border-slate-700 group-hover:border-red-400 transition-colors" />
                       <span className="text-xs text-slate-300 text-center line-clamp-1 w-16">{fav.name}</span>
                     </div>
                   ))}
                   <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-colors">
                     <Search className="w-5 h-5" />
                   </div>
                 </div>
               </section>

               {/* Últimos Acessados */}
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-white">Últimos Acessados</h2>
                 </div>
                 <div className="space-y-3">
                    {ULTIMOS_ACESSADOS.map(ua => (
                      <div key={ua.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800/50 transition-colors">
                         <span className="text-slate-200 font-medium text-sm">{ua.name}</span>
                         <span className="text-xs text-slate-500">{ua.time}</span>
                      </div>
                    ))}
                 </div>
               </section>
             </div>
          </div>

          {/* Serviços Recentes (OrdersList) */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Serviços Recentes
              </h2>
              <Link href="/meus-pedidos/todos" className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors flex items-center">
                Ver todos <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-2 dark-mode-orders-list">
                 {/* Utilizando o componente existente, porem em um container escuro */}
                 {/* Re-implementando uma versão glassmorphism aqui para combinar com o tema dark premium */}
                 <OrdersListDark />
              </div>
            </div>
          </section>

          {/* Avaliações Recentes */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Suas Avaliações</h2>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 shadow-lg relative">
              <div className="absolute top-0 right-0 text-9xl text-slate-700/10 font-serif leading-none select-none">"</div>
              {AVALIACOES_RECENTES.map(av => (
                <div key={av.id} className="relative z-10">
                   <div className="flex items-center gap-1 mb-2 text-amber-400">
                     {[...Array(av.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                   </div>
                   <p className="text-slate-300 italic mb-4">"{av.comment}"</p>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Para <strong className="text-slate-200">{av.pro}</strong></span>
                     <span className="text-slate-500 text-xs">{av.date}</span>
                   </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

// Dark mode specific orders list for premium dashboard
function OrdersListDark() {
  const orders = [
    { id: 'ORD-001', service: 'Limpeza Residencial', status: 'Em andamento', date: 'Hoje, 14:00', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { id: 'ORD-002', service: 'Manutenção Elétrica', status: 'Concluído', date: 'Ontem, 10:00', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  ];

  return (
    <div className="divide-y divide-slate-700/50">
      {orders.map((order) => {
        const Icon = order.icon;
        return (
          <div key={order.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between cursor-pointer rounded-xl m-1">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${order.bg} ${order.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">{order.service}</h4>
                <div className="text-sm text-slate-400 flex items-center gap-2 mt-1 font-medium">
                  <span>{order.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className={order.color}>{order.status}</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

