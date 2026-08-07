/* eslint-disable */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, CalendarDays, CheckCircle2, ChevronRight, Clock, 
  DollarSign, FileText, LayoutDashboard, MessageSquare, 
  Settings, Users, TrendingUp, Search, Bell
} from 'lucide-react';

export default function ProfissionalPedidosClient({ 
  metrics, 
  requests, 
  messages, 
  topClientes, 
  avaliacoes 
}: any) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar Panel */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 flex-col hidden lg:flex z-10 relative">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Obra<span className="text-indigo-500">Fácil</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-2">Painel de Operações</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('servicos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'servicos' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <FileText size={20} />
            <span className="font-medium">Serviços Ativos</span>
          </button>
          <button onClick={() => setActiveTab('agenda')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'agenda' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <CalendarDays size={20} />
            <span className="font-medium">Agenda</span>
          </button>
          <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'clientes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <Users size={20} />
            <span className="font-medium">Clientes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all cursor-not-allowed opacity-50" title="Financeiro (Em Desenvolvimento)">
            <BarChart3 size={20} />
            <span className="font-medium">Financeiro</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                PR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Minha Conta</p>
                <p className="text-xs text-slate-400 truncate">Profissional Verificado</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto hide-scrollbar">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar OS, cliente..." className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-64 transition-all" />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors cursor-not-allowed opacity-50" title="Notificações (Em Desenvolvimento)">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors cursor-not-allowed opacity-50" title="Configurações (Em Desenvolvimento)">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 pb-24 space-y-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Receita (Total)" value={metrics?.revenue || 'R$ 0,00'} icon={<DollarSign />} trend="+12.5%" color="indigo" />
                <KPICard title="Total de Pedidos" value={metrics?.totalRequests || '0'} icon={<FileText />} trend="+3.2%" color="blue" />
                <KPICard title="Taxa de Conversão" value={metrics?.conversion || '0%'} icon={<TrendingUp />} trend="+5.0%" color="emerald" />
                <KPICard title="Pedidos Ativos" value={metrics?.activeRequests || '0'} icon={<CheckCircle2 />} trend="-1.5%" color="purple" />
              </div>

              {/* Main Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Actions / Inbox */}
                <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Fila Operacional</h3>
                    <button onClick={() => setActiveTab('servicos')} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Ver todas</button>
                  </div>
                  
                  <div className="flex-1">
                    {requests && requests.length > 0 ? (
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/30 border-b border-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 rounded-tl-lg">Cliente</th>
                            <th className="px-4 py-3">Serviço</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Valor</th>
                            <th className="px-4 py-3 rounded-tr-lg">Status/Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.slice(0, 5).map((req: any) => (
                            <tr key={req.id} className="border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors group">
                              <td className="px-4 py-4 font-medium text-white">{req.solicitacao.cliente.nome}</td>
                              <td className="px-4 py-4 text-slate-300 truncate max-w-[150px]">{req.solicitacao.titulo}</td>
                              <td className="px-4 py-4 text-slate-400">{new Date(req.createdAt).toLocaleDateString('pt-BR')}</td>
                              <td className="px-4 py-4 font-medium text-emerald-400">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.valor)}
                              </td>
                              <td className="px-4 py-4">
                                {req.status === 'PENDENTE' ? (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={async () => {
                                        await fetch(`/api/propostas/${req.id}/status`, { method: 'POST', body: JSON.stringify({ status: 'ACEITA' }) });
                                        window.location.reload();
                                      }}
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/20"
                                    >Aceitar</button>
                                    <button 
                                      onClick={async () => {
                                        await fetch(`/api/propostas/${req.id}/status`, { method: 'POST', body: JSON.stringify({ status: 'RECUSADA' }) });
                                        window.location.reload();
                                      }}
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                                    >Recusar</button>
                                  </div>
                                ) : req.solicitacao.status === 'EM_EXECUCAO' && req.status === 'ACEITA' ? (
                                  <button 
                                    onClick={async () => {
                                      await fetch(`/api/solicitacoes/${req.solicitacao.id}/finalizar`, { method: 'POST' });
                                      window.location.reload();
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                                  >Finalizar OS</button>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                    req.status === 'ACEITA' || req.solicitacao.status === 'FINALIZADA' ? 'bg-emerald-500/10 text-emerald-400' :
                                    req.status === 'RECUSADA' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-700 text-slate-300'
                                  }`}>
                                    {req.solicitacao.status === 'FINALIZADA' ? 'CONCLUÍDO' : req.status}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                        <p>Nenhuma pendência na fila.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agenda Quick View */}
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Hoje</h3>
                    <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md">5 Ago</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { t: '09:00', label: 'Vistoria - Obra Centro', type: 'Externa' },
                      { t: '14:30', label: 'Início Instalação Hidráulica', type: 'Serviço' },
                      { t: '17:00', label: 'Alinhamento com Cliente', type: 'Online' },
                    ].map((e, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="text-sm font-bold text-indigo-400 pt-0.5">{e.t}</div>
                        <div>
                          <p className="font-semibold text-slate-200">{e.label}</p>
                          <p className="text-xs text-slate-500 mt-1">{e.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('agenda')} className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white transition-colors border border-slate-700/50">
                    Ver Agenda Completa
                  </button>
                </div>
              </div>

              {/* Secondary Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-indigo-400" /> Comunicações
                  </h3>
                  <div className="space-y-4">
                    {messages && messages.length > 0 ? messages.slice(0,3).map((m: any, i: number) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-white truncate">{m.name}</p>
                            <span className="text-xs text-slate-500">{new Date(m.time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className={`text-sm truncate mt-0.5 ${m.unread ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>{m.msg}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-slate-500 text-sm">Sem mensagens recentes.</p>
                    )}
                  </div>
                </div>

                {/* Top Clients */}
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Users size={20} className="text-emerald-400" /> Top Clientes
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {topClientes && topClientes.length > 0 ? topClientes.slice(0,3).map((c: any, i: number) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-3">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white truncate">{c.name}</p>
                        <p className="text-xs text-emerald-400 font-medium mt-1">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.revenue)}
                        </p>
                      </div>
                    )) : (
                      <p className="text-slate-500 text-sm col-span-3">Nenhum histórico disponível.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-16 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Módulo: {activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Este módulo foi redesenhado visualmente e encontra-se na fila de ativação funcional para a próxima Sprint.
              </p>
              <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                Voltar ao Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }: any) {
  const colorMap: any = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-sm font-medium text-slate-400 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
