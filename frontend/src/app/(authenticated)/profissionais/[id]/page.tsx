/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FavoriteButton } from "@/components/profissional/FavoriteButton";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Star, MapPin, CheckCircle, ShieldCheck, Clock, Award, Briefcase } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prof = await prisma.profissional.findUnique({
    where: { id: params.id },
    include: { user: true }
  });
  if (!prof) return { title: 'Profissional Não Encontrado' };
  return { title: `${prof.user.name} | ObraFácil Marketplace` };
}

export default async function ProfessionalProfile({ params }: { params: { id: string } }) {
  const prof = await prisma.profissional.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      servicos: {
        include: { categoria: true }
      },
      endereco: true,
      avaliacoesServico: true,
    }
  });

  if (!prof) {
    return notFound();
  }

  const initials = prof.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const especialidade = prof.servicos[0]?.categoria?.nome || "Profissional parceiro";

  let reviewsCount = 0;
  let rating = 0;
  if (prof.avaliacoesServico && prof.avaliacoesServico.length > 0) {
    reviewsCount = prof.avaliacoesServico.length;
    rating = Math.round(prof.avaliacoesServico.reduce((acc, curr) => acc + curr.nota, 0) / reviewsCount);
  }
  const displayRating = reviewsCount > 0 ? rating.toFixed(1) : "Novo";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-10">
        <Link href="/profissionais" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-medium mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Marketplace
        </Link>
        
        {/* Profile Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl mb-8">
          
          {/* Cover Photo */}
          <div className="h-48 md:h-64 w-full relative bg-slate-800">
            {prof.fotoCapa ? (
              <img src={prof.fotoCapa} alt="Capa" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                <Briefcase className="w-24 h-24 text-indigo-500/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
            
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border ${
                prof.ativo 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {prof.ativo ? '● Disponível' : '● Indisponível'}
              </span>
            </div>
          </div>
          
          {/* Profile Header Content */}
          <div className="px-6 md:px-10 pb-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              
              {/* Avatar */}
              <div className="-mt-20 md:-mt-24 z-10 relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-[#0f172a] bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                  {prof.fotoPerfil ? (
                    <img src={prof.fotoPerfil} alt={prof.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Main Info */}
              <div className="flex-1 pt-2 md:pt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                      {prof.user.name} <ShieldCheck className="text-indigo-400 w-6 h-6" />
                    </h1>
                    <p className="text-lg text-indigo-300 font-medium">{especialidade}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4">
                      <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{displayRating}</span>
                        <span className="text-amber-400/60 text-sm">({reviewsCount})</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{prof.endereco?.cidade ? `${prof.endereco.cidade}, ${prof.endereco.estado}` : 'Local não informado'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>{prof.obrasExecutadas || 0} obras entregues</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <FavoriteButton profissionalId={prof.id} initialIsFavorito={false} />
                    <Link href={`/solicitar-servico?profissionalId=${prof.id}`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
                      Solicitar Orçamento
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Sobre o Profissional
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {prof.descricao || "Profissional verificado com excelência técnica e alto rigor na entrega de resultados. Comprometido com prazos e qualidade no acabamento, garantindo a satisfação do cliente em cada etapa da obra."}
              </p>
            </div>

            {/* Gallery */}
            {prof.galeria && prof.galeria.length > 0 && (
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-indigo-400" /> Portfólio de Obras
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prof.galeria.map((url, idx) => (
                    <div key={idx} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
                      <img 
                        src={url} 
                        alt={`Obra ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white font-medium">Ver detalhes da obra</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews Section */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-400" /> Avaliações dos Clientes
              </h2>
              
              {prof.avaliacoesServico && prof.avaliacoesServico.length > 0 ? (
                <div className="space-y-6">
                  {prof.avaliacoesServico.map((av: { nota: number; comentario?: string | null }, idx: number) => (
                    <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl">
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(av.nota)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-300 italic">&quot;{av.comentario || 'Serviço prestado com muita qualidade e profissionalismo.'}&quot;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400">Este profissional ainda não possui avaliações.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-lg sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">Informações</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Disponibilidade</h3>
                  <div className="flex items-center gap-2 text-slate-200 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">Imediata</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Contato</h3>
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-slate-300">
                    Solicite um orçamento para liberar os dados de contato direto.
                  </div>
                </div>

                {prof.certificacoes && prof.certificacoes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Certificações</h3>
                    <ul className="space-y-2">
                      {prof.certificacoes.map((cert, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/30">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span>Identidade e documentos verificados pela plataforma.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
