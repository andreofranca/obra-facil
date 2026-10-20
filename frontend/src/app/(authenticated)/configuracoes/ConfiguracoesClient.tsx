"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, Key, Shield, LogOut, CheckCircle, AlertCircle, 
  Eye, EyeOff, Loader2, Check, Lock, Info
} from "lucide-react";
import { AuthSession } from "@/types/auth";

interface ConfiguracoesClientProps {
  user: AuthSession;
}

export default function ConfiguracoesClient({ user }: ConfiguracoesClientProps) {
  const router = useRouter();

  // Estados da troca de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados do logout
  const [loggingOut, setLoggingOut] = useState(false);

  // Validação dinâmica dos requisitos de senha
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!isPasswordValid) {
      setPasswordError("A nova senha deve atender a todos os requisitos de segurança listados.");
      return;
    }

    if (!passwordsMatch) {
      setPasswordError("A confirmação de senha não coincide com a nova senha digitada.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error?.message || "Erro ao alterar senha");
      }

      setPasswordSuccess("Senha alterada com sucesso! Utilize sua nova senha nos próximos acessos.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha na comunicação com o servidor";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 w-full text-slate-200 font-sans pb-24 overflow-x-hidden pt-8">
      <main className="px-4 sm:px-6 space-y-8 w-full max-w-5xl mx-auto">
        {/* Header da Página */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Configurações da Conta
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Gerencie suas credenciais de segurança, sessões ativas e preferências institucionais.
              </p>
            </div>
          </div>
        </div>

        {/* Seção 1: Segurança e Troca de Senha */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Segurança & Troca de Senha</h2>
              <p className="text-xs text-slate-400">
                Altere sua senha de acesso periodicamente para manter sua conta protegida.
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5">
            {/* Campo: Senha Atual */}
            <div>
              <label htmlFor="current-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  title={showCurrentPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Linha: Nova Senha e Confirmação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    title={showNewPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    title={showConfirmPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist de Requisitos de Complexidade */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Requisitos de Segurança da Nova Senha:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 ${hasMinLength ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-400" : "text-slate-600"}`} />
                  Mínimo de 8 caracteres
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUppercase ? "text-emerald-400" : "text-slate-600"}`} />
                  Pelo menos uma letra maiúscula (A-Z)
                </div>
                <div className={`flex items-center gap-2 ${hasLowercase ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${hasLowercase ? "text-emerald-400" : "text-slate-600"}`} />
                  Pelo menos uma letra minúscula (a-z)
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? "text-emerald-400" : "text-slate-600"}`} />
                  Pelo menos um número (0-9)
                </div>
                <div className={`flex items-center gap-2 ${hasSpecial ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${hasSpecial ? "text-emerald-400" : "text-slate-600"}`} />
                  Pelo menos um caractere especial (!@#$...)
                </div>
                <div className={`flex items-center gap-2 ${passwordsMatch ? "text-emerald-400" : "text-slate-500"}`}>
                  <Check className={`w-3.5 h-3.5 ${passwordsMatch ? "text-emerald-400" : "text-slate-600"}`} />
                  As senhas coincidem
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword || !isPasswordValid || !passwordsMatch || !currentPassword}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Atualizando Senha...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Salvar Nova Senha
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Seção 2: Sessão do Usuário & Encerramento Seguro */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sessão Ativa & Dispositivo</h2>
              <p className="text-xs text-slate-400">
                Sua conta está autenticada via cookie criptografado com chave institucional (HMAC-SHA256).
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sessão em Navegador Web Atual
              </p>
              <p className="text-xs text-slate-400">
                Usuário autenticado: <strong className="text-slate-300">{user.email}</strong> ({user.role === "PROFESSIONAL" ? "Profissional" : "Cliente"})
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Encerrando...
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  Encerrar Esta Sessão
                </>
              )}
            </button>
          </div>
        </div>

        {/* Seção 3: Informações do Sistema e Governança */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Info className="w-4 h-4 text-indigo-400" />
            Governança e Próximos Passos
          </div>
          <p>
            A plataforma ObraFácil opera sob a arquitetura de sessões seguras com cookies HttpOnly assinados. Funcionalidades de notificações por e-mail transacional e autenticação multifator (MFA) estão planejadas para as próximas etapas de evolução arquitetural.
          </p>
        </div>
      </main>
    </div>
  );
}
