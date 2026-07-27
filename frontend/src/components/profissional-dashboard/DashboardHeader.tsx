import { Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";

export interface DashboardHeaderProps {
  nome: string;
}

export function DashboardHeader({ nome }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-neutral-border">
      <div className="flex items-center gap-4">
        <Avatar initials={nome} className="w-14 h-14 text-xl shadow-sm" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-text">
            Olá, {nome}
          </h1>
          <p className="text-neutral-text/70 text-sm mt-1">
            Bem-vindo de volta ao seu painel operacional.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="hidden sm:inline-flex">
        Editar Perfil
      </Button>
    </header>
  );
}
