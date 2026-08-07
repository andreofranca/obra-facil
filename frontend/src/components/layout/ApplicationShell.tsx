"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Search, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Heart, 
  DollarSign, 
  User, 
  Settings, 
  LogOut,
  Bell, 
  Menu,
  X,
  ChevronRight,
  HardHat
} from "lucide-react";
import { AuthSession } from "@/types/auth";

type ApplicationShellProps = {
  children: React.ReactNode;
  user: AuthSession;
};

const MAIN_NAVIGATION = [
  { name: "Dashboard", href: "/", icon: Home, altHref: "/profissional/pedidos" },
  { name: "Marketplace", href: "/profissionais", icon: Search },
  { name: "Solicitações", href: "/minhas-solicitacoes", icon: FileText, altHref: "/profissional/pedidos" },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Mensagens", href: "/mensagens", icon: MessageSquare },
  { name: "Favoritos", href: "/meus-favoritos", icon: Heart },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign },
  { name: "Perfil", href: "/perfil", icon: User },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
  { name: "Sair", href: "#", icon: LogOut, isLogout: true },
];

export default function ApplicationShell({ children, user }: ApplicationShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fecha o menu mobile quando muda a rota
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const firstName = user?.name && user.name.trim() !== "" ? user.name.split(" ")[0] : "";
  const greetingName = firstName ? `Olá, ${firstName}!` : "Meu Perfil";
  const roleName = user?.role === "PROFESSIONAL" ? "Profissional" : "Cliente";
  
  // Resolve href baseado na role quando necessário
  const resolveHref = (item: typeof MAIN_NAVIGATION[0]) => {
    if (item.name === "Solicitações" && user?.role === "PROFESSIONAL") {
      return item.altHref || item.href;
    }
    if (item.name === "Dashboard") {
      return user?.role === "PROFESSIONAL" ? "/profissional/pedidos" : "/meus-pedidos";
    }
    return item.href;
  };

  const getBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ name: "Início", path: "/", isLast: true }];
    
    return paths.map((p, i) => {
      const isLast = i === paths.length - 1;
      const path = `/${paths.slice(0, i + 1).join('/')}`;
      const name = p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
      return { name, path, isLast };
    });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-50 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">ObraFácil</span>
          </Link>
        </div>

        {/* CENTER: SEARCH */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar profissionais, serviços ou obras..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
            />
          </div>
        </div>

        {/* RIGHT: USER CONTEXT */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary rounded-full"></span>
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">{greetingName}</p>
              <p className="text-xs text-brand-primary font-medium mt-1">{roleName}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors ml-1"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          absolute lg:static inset-y-0 left-0 z-40
          w-64 bg-slate-900 border-r border-slate-800 
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {MAIN_NAVIGATION.map((item) => {
              const href = resolveHref(item);
              const isActive = pathname === href || pathname.startsWith(href + '/');
              const Icon = item.icon;
              
              return item.isLogout ? (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-400 mt-4"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-brand-primary/10 text-brand-primary' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* OVERLAY FOR MOBILE */}
        {isMobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative">
          {/* BREADCRUMB */}
          <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50 px-6 py-3 flex items-center text-sm">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            {getBreadcrumb().map((crumb) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />
                {crumb.isLast ? (
                  <span className="text-slate-200 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.path} className="text-slate-400 hover:text-white transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* PAGE CONTENT */}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
