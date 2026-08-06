/* eslint-disable */
"use client";

import React, { useState } from 'react';

// SVG Icons
const IconCalendar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconDollar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconShoppingBag = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const IconMessage = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const IconUsers = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconStar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const IconClock = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconTrendingUp = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const IconCheckCircle = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconBriefcase = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconMap = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
const IconBell = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const IconSearch = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const MetricCard = ({ title, value, icon, trend, positive, color }: any) => (
  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-current`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm`}>
          {positive ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

export default function ProfissionalPedidosClient({ metrics, requests, messages, topClientes, avaliacoes }: { metrics?: any, requests?: any, messages?: any, topClientes?: any, avaliacoes?: any }) {
  const [activeTab, setActiveTab] = useState('visao-geral');

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'agenda', label: 'Agenda & Serviços' },
    { id: 'clientes', label: 'Clientes & Mensagens' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CRM Comercial</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio hoje.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <IconSearch />
            {/* Search Input Placeholder */}
            <input type="text" placeholder="Buscar pedidos..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
            <div className="absolute left-3.5 top-3 text-slate-400">
              <IconSearch />
            </div>
          </div>
          <span title="Notificações (Em Desenvolvimento)" className="cursor-not-allowed p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 shadow-sm transition-all relative">
            <IconBell />
          </span>
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-md cursor-pointer border-2 border-white"></div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'visao-geral' && (
        <div className="space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Receita (Total)" value={metrics?.revenue || 'R$ 0,00'} icon={<IconDollar />} positive={true} color="text-emerald-600 bg-emerald-100" />
            <MetricCard title="Total de Pedidos" value={metrics?.totalRequests || '0'} icon={<IconShoppingBag />} positive={true} color="text-blue-600 bg-blue-100" />
            <MetricCard title="Taxa de Conversão" value={metrics?.conversion || '0%'} icon={<IconTrendingUp />} positive={true} color="text-indigo-600 bg-indigo-100" />
            <MetricCard title="Pedidos Ativos" value={metrics?.activeRequests || '0'} icon={<IconBriefcase />} positive={true} color="text-amber-500 bg-amber-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Histórico / Atividades Recentes */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Novas Solicitações & Histórico</h2>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver tudo</button>
              </div>
              <div className="space-y-4">
                {requests && requests.length > 0 ? requests.slice(0, 5).map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-full bg-white shadow-sm flex-shrink-0 ${
                        item.status === 'ACEITA' || item.solicitacao.status === 'FINALIZADA' ? 'text-emerald-500' :
                        item.status === 'RECUSADA' ? 'text-rose-500' : 
                        item.status === 'PENDENTE' ? 'text-blue-500' : 'text-amber-500'
                      }`}>
                        {item.status === 'ACEITA' || item.solicitacao.status === 'FINALIZADA' ? <IconCheckCircle /> :
                         item.status === 'RECUSADA' ? <IconClock /> : 
                         item.status === 'PENDENTE' ? <IconBell /> : <IconBriefcase />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{item.solicitacao.titulo}</h4>
                        <p className="text-sm text-slate-500">{item.solicitacao.cliente.nome} • {new Date(item.createdAt).toLocaleDateString('pt-BR')} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</p>
                      </div>
                    </div>
                    {item.status === 'PENDENTE' ? (
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button 
                          onClick={async () => {
                            await fetch(`/api/propostas/${item.id}/status`, { method: 'POST', body: JSON.stringify({ status: 'ACEITA' }) });
                            window.location.reload();
                          }}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Aceitar
                        </button>
                        <button 
                          onClick={async () => {
                            await fetch(`/api/propostas/${item.id}/status`, { method: 'POST', body: JSON.stringify({ status: 'RECUSADA' }) });
                            window.location.reload();
                          }}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          Recusar
                        </button>
                      </div>
                    ) : item.solicitacao.status === 'EM_EXECUCAO' && item.status === 'ACEITA' ? (
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button 
                          onClick={async () => {
                            await fetch(`/api/solicitacoes/${item.solicitacao.id}/finalizar`, { method: 'POST' });
                            window.location.reload();
                          }}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Finalizar Serviço
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white border self-end sm:self-auto ${
                        item.status === 'ACEITA' || item.solicitacao.status === 'FINALIZADA' ? 'text-emerald-700 border-emerald-200' : 
                        item.status === 'RECUSADA' ? 'text-rose-700 border-rose-200' : 
                        'text-amber-700 border-amber-200'
                      }`}>
                        {item.solicitacao.status === 'FINALIZADA' ? 'Finalizado' : item.status}
                      </span>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 py-4 text-center">Nenhum histórico disponível.</p>
                )}
              </div>
            </div>

            {/* Serviços em andamento */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-blue-500/10 blur-3xl rounded-full"></div>
              <h2 className="text-xl font-bold mb-6 relative z-10">Serviços em Andamento</h2>
              <div className="space-y-5 relative z-10">
                {requests && requests.filter((r: any) => r.solicitacao.status === 'EM_EXECUCAO').length > 0 ? (
                  requests.filter((r: any) => r.solicitacao.status === 'EM_EXECUCAO').slice(0, 3).map((service: any) => (
                    <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-white">{service.solicitacao.titulo}</h4>
                        <span className="text-xs font-medium text-blue-300">Em andamento</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{service.solicitacao.cliente.nome}</p>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000 w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-300 py-4 text-center">Nenhum serviço em andamento no momento.</p>
                )}
              </div>
              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold transition-colors border border-white/10">
                Gerenciar Serviços
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Agenda */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <IconCalendar /> Agenda do Dia
              </h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">5 de Agosto</span>
            </div>
            <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-8">
              {[
                { time: '09:00', title: 'Orçamento - Pintura', type: 'Visita', color: 'border-blue-500 bg-blue-500' },
                { time: '14:30', title: 'Início da Reforma', type: 'Serviço', color: 'border-emerald-500 bg-emerald-500' },
                { time: '17:00', title: 'Reunião Cliente', type: 'Online', color: 'border-indigo-500 bg-indigo-500' },
              ].map((evt, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm ${evt.color}`}></div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <span className="text-xs font-bold text-slate-400 mb-1 block">{evt.time}</span>
                    <h4 className="font-semibold text-slate-800">{evt.title}</h4>
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {evt.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de Solicitações */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <IconMap /> Mapa de Solicitações
            </h2>
            <div className="flex-1 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-50/50 group-hover:bg-blue-50/80 transition-colors z-0"></div>
              <div className="p-4 bg-white rounded-full text-blue-500 shadow-sm z-10 mb-2">
                <IconMap />
              </div>
              <p className="text-slate-800 font-semibold mt-3 z-10">Integração com Mapas ativada</p>
              <p className="text-slate-500 text-sm mt-1 z-10 text-center px-6">Visualize a localização dos seus próximos atendimentos para otimizar rotas.</p>
              <button className="mt-4 z-10 px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-[0_4px_14px_0_rgb(0,118,255,0.15)] border border-blue-100 hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 transition-all">
                Abrir Mapa Completo
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clientes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Mensagens */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <IconMessage /> Mensagens Recentes
              </h2>
              {messages && messages.filter((m: any) => m.unread).length > 0 && (
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
                  {messages.filter((m: any) => m.unread).length} Novas
                </span>
              )}
            </div>
            <div className="space-y-4">
              {messages && messages.length > 0 ? messages.map((msg: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-semibold ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.name}</h4>
                      <span className="text-xs text-slate-400">{new Date(msg.time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className={`text-sm mt-1 truncate ${msg.unread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {msg.msg}
                    </p>
                  </div>
                  {msg.unread && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              )) : (
                <p className="text-sm text-slate-500 py-4 text-center">Nenhuma mensagem recente.</p>
              )}
            </div>
          </div>

          {/* Clientes & Avaliações */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <IconUsers /> Top Clientes
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x hide-scrollbar">
                {topClientes && topClientes.length > 0 ? topClientes.map((cli: any, idx: number) => (
                  <div key={idx} className="snap-start min-w-[140px] p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="w-14 h-14 bg-slate-200 rounded-full mb-3 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {cli.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{cli.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{cli.services} serviços</p>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-full">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cli.revenue)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 py-4 text-center w-full">Sem dados de clientes ainda.</p>
                )}
              </div>
            </div>

            {avaliacoes && avaliacoes.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-7 shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <IconStar /> Última Avaliação!
                  </h2>
                  <div className="flex gap-1 text-white">
                    {[...Array(avaliacoes[0].nota)].map((_, i) => <IconStar key={i} />)}
                  </div>
                </div>
                <p className="text-amber-50 text-lg font-medium italic mb-4 relative z-10">
                  "{avaliacoes[0].comentario || 'Ótimo serviço!'}"
                </p>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-sm font-semibold text-amber-100">- {avaliacoes[0].name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

