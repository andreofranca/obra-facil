import { Card } from "@/components/ui/Card";

export function DashboardSidebar() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="p-5 bg-white/60 backdrop-blur-sm border-neutral-border">
        <h3 className="font-bold text-neutral-text mb-4">Resumo</h3>
        <p className="text-sm text-neutral-text/70 mb-4">
          Acompanhe o andamento das suas propostas e mantenha seu perfil sempre atualizado para atrair mais clientes.
        </p>
        <div className="h-2 w-full bg-neutral-surface rounded-full overflow-hidden">
          <div className="h-full bg-brand-primary w-2/3"></div>
        </div>
        <p className="text-xs text-neutral-text/60 mt-2 text-right">66% de taxa de conversão</p>
      </Card>

      <Card className="p-5 bg-white/60 backdrop-blur-sm border-neutral-border">
        <h3 className="font-bold text-neutral-text mb-4">Últimas atividades</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-primary"></div>
            <div>
              <p className="text-sm font-medium text-neutral-text">Proposta visualizada</p>
              <p className="text-xs text-neutral-text/60">Há 2 horas</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-feedback-success"></div>
            <div>
              <p className="text-sm font-medium text-neutral-text">Novo serviço concluído</p>
              <p className="text-xs text-neutral-text/60">Ontem</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-white/60 backdrop-blur-sm border-neutral-border">
        <h3 className="font-bold text-neutral-text mb-4">Atalhos</h3>
        <div className="flex flex-col gap-2">
          <button className="text-left text-sm text-brand-primary font-medium hover:underline">
            Atualizar catálogo de serviços
          </button>
          <button className="text-left text-sm text-brand-primary font-medium hover:underline">
            Configurar notificações
          </button>
        </div>
      </Card>
    </div>
  );
}
