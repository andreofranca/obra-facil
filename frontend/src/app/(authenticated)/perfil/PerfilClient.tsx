"use client";

import React, { useState } from "react";
import { 
  User, Mail, Phone, Calendar, ShieldCheck, MapPin, 
  Briefcase, Award, CheckCircle, AlertCircle, Loader2, Info
} from "lucide-react";

export type PerfilUserData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
  createdAt: string;
  cliente?: {
    id: string;
    _count: {
      solicitacoes: number;
      avaliacoesServico: number;
      favoritos: number;
    };
  } | null;
  profissional?: {
    id: string;
    descricao: string | null;
    experiencia: number | null;
    ativo: boolean;
    fotoPerfil: string | null;
    fotoCapa: string | null;
    obrasExecutadas: number | null;
    disponibilidade: string | null;
    whatsapp: string | null;
    endereco: {
      cidade: string | null;
      estado: string | null;
      bairro: string | null;
      cep: string | null;
      logradouro: string | null;
      numero: string | null;
      complemento: string | null;
    } | null;
    servicos?: {
      id: string;
      titulo: string;
      categoria: {
        id: string;
        nome: string;
      };
    }[];
    _count: {
      solicitacoes: number;
      avaliacoesServico: number;
      propostas: number;
    };
  } | null;
};

interface PerfilClientProps {
  initialUser: PerfilUserData;
}

export default function PerfilClient({ initialUser }: PerfilClientProps) {
  const [user, setUser] = useState<PerfilUserData>(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [descricao, setDescricao] = useState(initialUser.profissional?.descricao || "");
  const [experiencia, setExperiencia] = useState<number | string>(initialUser.profissional?.experiencia ?? "");
  const [whatsapp, setWhatsapp] = useState(initialUser.profissional?.whatsapp || "");
  const [cidade, setCidade] = useState(initialUser.profissional?.endereco?.cidade || "");
  const [estado, setEstado] = useState(initialUser.profissional?.endereco?.estado || "");
  const [fotoPerfil, setFotoPerfil] = useState(initialUser.profissional?.fotoPerfil || "");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPro = user.role === "PROFESSIONAL";

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "OF";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        phone: phone.trim() === "" ? null : phone.trim(),
      };

      if (isPro) {
        payload.descricao = descricao.trim();
        payload.experiencia = experiencia === "" ? null : Number(experiencia);
        payload.whatsapp = whatsapp.trim() === "" ? null : whatsapp.trim();
        payload.cidade = cidade.trim();
        payload.estado = estado.trim();
        payload.fotoPerfil = fotoPerfil.trim() === "" ? null : fotoPerfil.trim();
      }

      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error?.message || "Erro ao salvar perfil");
      }

      setSuccessMessage("Perfil atualizado com sucesso!");
      // Atualiza estado local
      setUser((prev) => ({
        ...prev,
        name: name.trim(),
        phone: phone.trim() === "" ? null : phone.trim(),
        profissional: prev.profissional
          ? {
              ...prev.profissional,
              descricao: descricao.trim(),
              experiencia: experiencia === "" ? null : Number(experiencia),
              whatsapp: whatsapp.trim() === "" ? null : whatsapp.trim(),
              fotoPerfil: fotoPerfil.trim() === "" ? null : fotoPerfil.trim(),
              endereco: {
                cidade: cidade.trim() || null,
                estado: estado.trim() || null,
                bairro: prev.profissional.endereco?.bairro || null,
                cep: prev.profissional.endereco?.cep || null,
                logradouro: prev.profissional.endereco?.logradouro || null,
                numero: prev.profissional.endereco?.numero || null,
                complemento: prev.profissional.endereco?.complemento || null,
              },
            }
          : null,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full text-slate-200 font-sans pb-24 overflow-x-hidden pt-8">
      <main className="px-4 sm:px-6 space-y-8 w-full max-w-5xl mx-auto">
        {/* Cabeçalho do Perfil Real */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Real ou Iniciais */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-brand-primary to-indigo-600 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                  {fotoPerfil && fotoPerfil.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={fotoPerfil} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={() => setFotoPerfil("")} 
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações de Identidade */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-center sm:self-auto ${
                  isPro 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                    : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isPro ? "Profissional Verificado" : "Cliente"}
                </span>
              </div>

              <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                {user.email}
              </p>

              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2 pt-1">
                <Calendar className="w-4 h-4 text-slate-500" />
                Membro desde {formattedDate}
              </p>
            </div>
          </div>

          {/* Cards de Métricas Reais do Domínio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/50">
            {isPro ? (
              <>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Serviços Executados</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.profissional?._count.solicitacoes ?? 0}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Propostas Enviadas</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.profissional?._count.propostas ?? 0}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Avaliações Recebidas</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.profissional?._count.avaliacoesServico ?? 0}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Solicitações Publicadas</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.cliente?._count.solicitacoes ?? 0}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Avaliações Realizadas</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.cliente?._count.avaliacoesServico ?? 0}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-400">Profissionais Favoritos</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.cliente?._count.favoritos ?? 0}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Banners de Notificação */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Edição de Dados Reais */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              Editar Dados do Perfil
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Mantenha suas informações cadastrais atualizadas para melhorar sua experiência na plataforma.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Linha 1: Nome e E-mail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="perfil-nome" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="perfil-nome"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="perfil-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  E-mail (Identificador da Conta)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    id="perfil-email"
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-400 cursor-not-allowed select-none"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Para alterar seu e-mail, entre em contato com o suporte institucional.
                </span>
              </div>
            </div>

            {/* Linha 2: Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="perfil-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Telefone Principal
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="perfil-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                </div>
              </div>

              {isPro && (
                <div>
                  <label htmlFor="perfil-whatsapp" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    WhatsApp Comercial
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="perfil-whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Campos Específicos de Profissional */}
            {isPro && (
              <>
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    Dados Profissionais & Atuação
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="perfil-descricao" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Biografia / Apresentação Profissional
                      </label>
                      <textarea
                        id="perfil-descricao"
                        rows={4}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descreva suas especialidades, métodos de trabalho e qualificações..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block text-right">
                        {descricao.length}/2000 caracteres
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label htmlFor="perfil-experiencia" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                          Experiência (Anos)
                        </label>
                        <input
                          id="perfil-experiencia"
                          type="number"
                          min={0}
                          max={60}
                          value={experiencia}
                          onChange={(e) => setExperiencia(e.target.value)}
                          placeholder="Ex: 5"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="perfil-cidade" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                          Cidade de Atuação
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            id="perfil-cidade"
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            placeholder="Sua cidade"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="perfil-estado" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                          Estado (UF)
                        </label>
                        <input
                          id="perfil-estado"
                          type="text"
                          maxLength={2}
                          value={estado}
                          onChange={(e) => setEstado(e.target.value.toUpperCase())}
                          placeholder="SP"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="perfil-foto" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        URL da Foto de Perfil (Opcional)
                      </label>
                      <input
                        id="perfil-foto"
                        type="url"
                        value={fotoPerfil}
                        onChange={(e) => setFotoPerfil(e.target.value)}
                        placeholder="https://exemplo.com/sua-foto.jpg"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                      />
                      {/* Transparência sobre armazenamento de imagem */}
                      <div className="mt-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Nota de Infraestrutura:</strong> O sistema suporta links HTTPS diretos de fotos e gera avatares institucionais automáticos. O upload direto de arquivos locais será integrado na fase de storage em nuvem.
                        </span>
                      </div>
                    </div>

                    {/* Categorias Cadastradas */}
                    {user.profissional?.servicos && user.profissional.servicos.length > 0 && (
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                          Especialidades Habilitadas no Marketplace
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {user.profissional.servicos.map((srv) => (
                            <span
                              key={srv.id}
                              className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium rounded-lg flex items-center gap-1.5"
                            >
                              <Award className="w-3.5 h-3.5" />
                              {srv.categoria.nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Ação de Submissão */}
            <div className="pt-4 border-t border-slate-700/50 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando Dados...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
