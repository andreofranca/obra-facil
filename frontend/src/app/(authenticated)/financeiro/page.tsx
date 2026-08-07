"use client";
import React from 'react';
import { DollarSign, Search, Filter, Plus, ChevronRight, MoreVertical } from 'lucide-react';

export default function FinanceiroPage() {
  return (
    <div className="flex-1 w-full text-slate-200 font-sans pb-24 overflow-x-hidden pt-10">
      <main className="px-6 space-y-8 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
                <DollarSign size={28} />
              </div>
              Financeiro
            </h1>
            <p className="text-slate-400 mt-2">Gerencie e acompanhe suas atividades em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
            <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Filter size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium text-sm">
              <Plus size={18} />
              Novo Registro
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Registros Recentes</h2>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 hover:bg-slate-800/20 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-green-400 group-hover:bg-green-500/10 transition-colors">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Registro de Atividade #{1000 + i}</h3>
                    <p className="text-sm text-slate-500 mt-1">Atualizado hoje às 14:{30 + i}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    Concluído
                  </span>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-800 flex justify-center">
            <button className="text-sm font-medium text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors">
              Carregar mais resultados
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
