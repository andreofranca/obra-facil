import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export interface DashboardStatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function DashboardStatCard({ label, value, icon }: DashboardStatCardProps) {
  return (
    <Card className="flex items-center p-5 bg-white/60 backdrop-blur-sm border-neutral-border hover:shadow-sm transition-shadow">
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-text/60 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-3xl font-bold text-neutral-text">
          {value}
        </span>
      </div>
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          {icon}
        </div>
      )}
    </Card>
  );
}
