"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Logo } from "@/components/ui";
import { TextInput } from "@/components/form/TextInput";
import { EmailInput } from "@/components/form/EmailInput";
import { PhoneInput } from "@/components/form/PhoneInput";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Textarea } from "@/components/form/Textarea";
import type { AuthErrorResponse, AuthResponse } from "@/types/auth";
import { Briefcase, UserCheck, AlertCircle } from "lucide-react";
import { LIMITS } from "@/lib/constants/limits";
import { isValidPhone } from "@/lib/validation/phone";
import { isValidPassword } from "@/lib/validation/password";
import { useRouter } from "next/navigation";

export type CategoriaOption = {
  id: string;
  nome: string;
};

interface CadastroProfissionalClientProps {
  categorias: CategoriaOption[];
}

const registerProfissionalSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(LIMITS.NAME_MAX, "Nome muito longo"),
    email: z.string().email("E-mail inválido").max(LIMITS.EMAIL_MAX, "E-mail muito longo"),
    phone: z
      .string()
      .min(10, "Telefone incompleto")
      .refine((val) => isValidPhone(val), "Telefone inválido (use DDD + número)"),
    categoriaId: z.string().min(1, "Selecione sua especialidade principal"),
    cidade: z.string().min(2, "Informe a cidade onde você atende").max(100),
    estado: z
      .string()
      .min(2, "UF deve ter 2 letras")
      .max(2, "Use a sigla da UF (ex: SP)")
      .toUpperCase(),
    experiencia: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 60),
        "Anos de experiência inválidos (0 a 60)"
      ),
    descricao: z
      .string()
      .min(10, "Descreva sua experiência e diferenciais (mínimo 10 caracteres)")
      .max(LIMITS.DESCRIPTION_MAX, "Apresentação muito longa"),
    password: z
      .string()
      .refine(
        (val) => isValidPassword(val),
        "A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolo especial"
      ),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
    terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterProfissionalFormData = z.infer<typeof registerProfissionalSchema>;

export function CadastroProfissionalClient({
  categorias,
}: CadastroProfissionalClientProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProfissionalFormData>({
    resolver: zodResolver(registerProfissionalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      categoriaId: "",
      cidade: "",
      estado: "",
      descricao: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterProfissionalFormData) {
    setErrorMessage("");

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        categoriaId: data.categoriaId,
        descricao: data.descricao,
        cidade: data.cidade,
        estado: data.estado,
        experiencia: data.experiencia ? Number(data.experiencia) : undefined,
      };

      const response = await fetch("/api/auth/register-profissional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as
        | AuthResponse
        | AuthErrorResponse;

      if (!response.ok) {
        setErrorMessage(
          "error" in responseData
            ? responseData.error
            : "Não foi possível criar o cadastro de profissional"
        );
        return;
      }

      // Redireciona o profissional diretamente para o seu painel de pedidos / CRM
      router.push("/profissional/pedidos");
    } catch {
      setErrorMessage("Erro inesperado de conexão ao criar cadastro");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center">
        <Link
          href="/"
          className="outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm transition-transform hover:-translate-y-0.5"
          aria-label="Voltar para a página inicial"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-muted hidden sm:inline">Já tem uma conta?</span>
          <Link
            href="/login"
            className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md px-4 py-2 bg-neutral-white shadow-soft hover:shadow-elevated"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:flex-row-reverse pt-20 lg:pt-0">
        {/* Lateral Informativa */}
        <div className="hidden lg:flex flex-1 relative bg-brand-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-brand-secondary/40 mix-blend-multiply z-10" />
          <Image
            src="/images/signup-hero.jpg"
            alt="Profissional qualificado em atividade"
            fill
            className="object-cover opacity-85"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/95 via-brand-primary/40 to-transparent z-20" />

          <div className="relative z-30 p-16 max-w-xl self-end mb-16 text-neutral-white animate-fade-in-up text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold mb-4 border border-white/20">
              <Briefcase size={16} /> Área do Parceiro Profissional
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
              Conecte-se com clientes prontos para contratar.
            </h2>
            <p className="text-lg text-neutral-white/90 leading-relaxed">
              Receba pedidos de orçamento direto na sua região, gerencie propostas e construa sua reputação com avaliações verificadas.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
          <Card className="w-full max-w-lg p-8 md:p-10 bg-neutral-surface shadow-elevated border-none lg:shadow-none lg:border lg:border-neutral-border lg:bg-transparent rounded-3xl lg:rounded-none">
            {/* Seletor de Tipo de Cadastro */}
            <div className="flex rounded-xl bg-slate-800/20 p-1 mb-8 border border-neutral-border">
              <Link
                href="/cadastro"
                className="flex-1 py-2 text-center text-sm font-medium text-neutral-muted hover:text-neutral-text transition-colors rounded-lg flex items-center justify-center gap-2"
              >
                <UserCheck size={16} />
                Quero Contratar
              </Link>
              <div
                className="flex-1 py-2 text-center text-sm font-semibold text-brand-primary bg-neutral-white shadow-sm rounded-lg flex items-center justify-center gap-2"
              >
                <Briefcase size={16} />
                Sou Profissional
              </div>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-neutral-text mb-2 tracking-tight">
                Cadastro de Profissional
              </h1>
              <p className="text-neutral-muted text-base">
                Crie seu perfil profissional e comece a receber solicitações no ObraFácil.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-fade-in"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Nome */}
              <TextInput
                id="name"
                label="Nome Completo *"
                placeholder="Ex: Carlos Silva"
                error={errors.name?.message}
                {...register("name")}
              />

              {/* Email e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EmailInput
                  id="email"
                  label="E-mail Comercial *"
                  placeholder="seu.email@exemplo.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PhoneInput
                  id="phone"
                  label="Telefone / WhatsApp *"
                  placeholder="(11) 98765-4321"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>

              {/* Especialidade Principal */}
              <div>
                <label htmlFor="categoriaId" className="block text-sm font-medium text-neutral-text mb-1.5">
                  Especialidade Principal *
                </label>
                <select
                  id="categoriaId"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-white text-neutral-text text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.categoriaId
                      ? "border-red-500 focus:border-red-500"
                      : "border-neutral-border focus:border-brand-primary"
                  }`}
                  defaultValue=""
                  {...register("categoriaId")}
                >
                  <option value="" disabled>
                    Selecione sua especialidade
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                {errors.categoriaId && (
                  <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>
                )}
              </div>

              {/* Localização e Experiência */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <TextInput
                    id="cidade"
                    label="Cidade de Atuação *"
                    placeholder="Ex: São Paulo"
                    error={errors.cidade?.message}
                    {...register("cidade")}
                  />
                </div>
                <div>
                  <TextInput
                    id="estado"
                    label="UF *"
                    placeholder="SP"
                    maxLength={2}
                    error={errors.estado?.message}
                    {...register("estado")}
                  />
                </div>
              </div>

              <div>
                <TextInput
                  id="experiencia"
                  type="number"
                  label="Anos de Experiência (Opcional)"
                  placeholder="Ex: 8"
                  min="0"
                  max="60"
                  error={errors.experiencia?.message}
                  {...register("experiencia")}
                />
              </div>

              {/* Apresentação / Bio */}
              <div>
                <Textarea
                  id="descricao"
                  label="Apresentação Profissional *"
                  placeholder="Conte um pouco sobre sua experiência, tipos de serviços executados e garantias oferecidas..."
                  rows={3}
                  error={errors.descricao?.message}
                  {...register("descricao")}
                />
                <span className="text-xs text-neutral-muted block mt-1">
                  Mínimo de 10 caracteres. Essa descrição aparecerá no seu perfil do marketplace.
                </span>
              </div>

              {/* Senhas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordInput
                  id="password"
                  label="Senha *"
                  placeholder="Mínimo 8 caracteres"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirmar Senha *"
                  placeholder="Repita a senha"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>

              {/* Termos de Uso */}
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-neutral-border cursor-pointer"
                    {...register("terms")}
                  />
                  <span className="text-sm text-neutral-muted leading-tight">
                    Li e concordo com os{" "}
                    <Link href="/termos" className="text-brand-primary hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link href="/privacidade" className="text-brand-primary hover:underline">
                      Política de Privacidade
                    </Link>{" "}
                    para prestadores parceiros.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs">{errors.terms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando perfil profissional..." : "Cadastrar como Profissional"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
