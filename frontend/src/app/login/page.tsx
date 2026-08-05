"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Logo } from "@/components/ui";
import { EmailInput } from "@/components/form/EmailInput";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Footer } from "@/components/layout";
import type { AuthErrorResponse, AuthResponse } from "@/types/auth";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(data: LoginFormData) {
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = (await response.json()) as AuthResponse | AuthErrorResponse;

      if (!response.ok) {
        const message = "error" in responseData && typeof responseData.error === 'string'
          ? responseData.error
          : "Não foi possível entrar";
        setErrorMessage(message);
        return;
      }

      if ("user" in responseData && responseData.user) {
        if (responseData.user.role === "PROFESSIONAL") {
          router.push("/profissional/pedidos");
        } else {
          router.push("/meus-pedidos");
        }
      }
    } catch {
      setErrorMessage("Erro inesperado ao fazer login");
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
          href="/cadastro" 
          className="text-neutral-text font-medium text-sm hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md px-4 py-2 bg-neutral-white shadow-soft hover:shadow-elevated"
        >
          Criar conta
        </Link>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:flex flex-1 relative bg-brand-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-brand-secondary/30 mix-blend-multiply z-10" />
          <Image
            src="/images/login-hero.jpg"
            alt="Mesa de projetos arquitetônicos, simbolizando confiança e alta qualidade."
            fill
            className="object-cover opacity-90"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-transparent to-transparent z-20" />
          
          <div className="relative z-30 p-16 max-w-xl self-end mb-16 text-neutral-white animate-fade-in-up">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
              A base sólida para o sucesso da sua obra.
            </h2>
            <p className="text-lg text-neutral-white/90 leading-relaxed">
              Conecte-se com clientes ou encontre especialistas em poucos cliques. O Marketplace número um em serviços premium.
            </p>
          </div>
        </div>

        <div className="lg:hidden w-full h-48 relative bg-brand-primary">
          <Image
            src="/images/login-hero.jpg"
            alt="Mesa de projetos arquitetônicos"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-background to-transparent" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative -mt-8 lg:mt-0 z-10">
          <Card className="w-full max-w-md p-8 md:p-10 bg-neutral-surface shadow-elevated border-none lg:shadow-none lg:border lg:border-neutral-border lg:bg-transparent rounded-3xl lg:rounded-none">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-neutral-text mb-2 tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-neutral-muted text-base">
                Insira suas credenciais para acessar sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <EmailInput
                id="email"
                placeholder="Seu email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="space-y-1">
                <PasswordInput
                  id="password"
                  placeholder="Sua senha"
                  leftIcon={<Lock className="w-5 h-5" />}
                  error={errors.password?.message}
                  {...register("password")}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-neutral-border text-brand-primary focus:ring-brand-primary focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer"
                    />
                    <span className="text-sm font-medium text-neutral-muted group-hover:text-neutral-text transition-colors">
                      Lembrar-me
                    </span>
                  </label>

                  <a 
                    href="#esqueci-senha" 
                    className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
                  >
                    Esqueci a senha
                  </a>
                </div>
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
                className="w-full rounded-xl shadow-elevated transition-all hover:-translate-y-0.5 group"
                isLoading={isSubmitting}
              >
                {!isSubmitting && (
                  <span className="flex items-center gap-2">
                    Entrar
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
