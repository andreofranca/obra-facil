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
import { Footer } from "@/components/layout";
import type { AuthErrorResponse, AuthResponse } from "@/types/auth";
import { ArrowRight, User, Mail, Phone, Lock } from "lucide-react";
import { LIMITS } from "@/lib/constants/limits";
import { isValidPhone } from "@/lib/validation/phone";
import { isValidPassword } from "@/lib/validation/password";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(LIMITS.NAME_MAX, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().refine((val) => !val || isValidPhone(val), "Telefone inválido").optional(),
  password: z.string().refine((val) => isValidPassword(val), "A senha não atende aos requisitos de segurança"),
  terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" }
  });

  async function onSubmit(data: RegisterFormData) {
    setErrorMessage("");

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as AuthResponse | AuthErrorResponse;

      if (!response.ok) {
        setErrorMessage("error" in responseData ? responseData.error : "Não foi possível criar o cadastro");
        return;
      }

      router.push("/meus-pedidos");
    } catch {
      setErrorMessage("Erro inesperado ao criar cadastro");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <header className="absolute top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center">
        <Link 
          href="/" 
          className="outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm transition-transform hover:-translate-y-0.5"
          aria-label="Voltar para a página inicial"
        >
          <Logo />
        </Link>
        <Link 
          href="/login" 
          className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md px-4 py-2 bg-neutral-white shadow-soft hover:shadow-elevated"
        >
          Entrar
        </Link>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row-reverse">
        <div className="hidden lg:flex flex-1 relative bg-brand-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-brand-secondary/30 mix-blend-multiply z-10" />
          <Image
            src="/images/signup-hero.jpg"
            alt="Mãos habilidosas trabalhando em um projeto, simbolizando a comunidade de profissionais qualificados."
            fill
            className="object-cover opacity-90"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-transparent to-transparent z-20" />
          
          <div className="relative z-30 p-16 max-w-xl self-end mb-16 text-neutral-white animate-fade-in-up text-right">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
              Junte-se aos melhores.
            </h2>
            <p className="text-lg text-neutral-white/90 leading-relaxed">
              Expanda sua rede de clientes ou encontre profissionais verificados para tirar seu projeto do papel.
            </p>
          </div>
        </div>

        <div className="lg:hidden w-full h-48 relative bg-brand-primary">
          <Image
            src="/images/signup-hero.jpg"
            alt="Mãos habilidosas trabalhando"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-background to-transparent" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative -mt-8 lg:mt-0 z-10">
          <Card className="w-full max-w-md p-8 md:p-10 bg-neutral-surface shadow-elevated border-none lg:shadow-none lg:border lg:border-neutral-border lg:bg-transparent rounded-3xl lg:rounded-none">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-neutral-text mb-2 tracking-tight">
                Criar sua conta
              </h1>
              <p className="text-neutral-muted text-base">
                Preencha seus dados para começar a usar a plataforma.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              <TextInput
                id="name"
                placeholder="Nome completo"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.name?.message}
                {...register("name")}
              />

              <EmailInput
                id="email"
                placeholder="Seu melhor email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <PhoneInput
                id="phone"
                placeholder="Telefone (Opcional)"
                leftIcon={<Phone className="w-5 h-5" />}
                error={errors.phone?.message}
                {...register("phone")}
              />

              <PasswordInput
                id="password"
                placeholder="Crie uma senha forte"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register("password")}
              />
              
              <div className="flex flex-col gap-1 pt-2 pb-2">
                <div className="flex items-start gap-2">
                  <div className="flex items-center h-5">
                    <input 
                      id="terms"
                      type="checkbox" 
                      className="w-4 h-4 rounded border-neutral-border text-brand-primary focus:ring-brand-primary focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer"
                      {...register("terms")}
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm font-medium text-neutral-muted cursor-pointer leading-tight">
                    Eu concordo com os Termos de Uso e a Política de Privacidade.
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm font-medium text-feedback-error mt-1">{errors.terms.message}</p>
                )}
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-feedback-error/10 border border-feedback-error/20 flex items-start gap-3 animate-fade-in-up" role="alert">
                  <div className="text-feedback-error mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-feedback-error">
                    {errorMessage}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl shadow-elevated transition-all hover:-translate-y-0.5 group mt-2"
                isLoading={isSubmitting}
              >
                {!isSubmitting && (
                  <span className="flex items-center gap-2">
                    Criar conta
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      
      <div className="lg:hidden mt-auto">
        <Footer />
      </div>
    </div>
  );
}
