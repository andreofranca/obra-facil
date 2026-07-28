import React, { ReactNode } from "react";
import { Icon, type IconName } from "@/platform/icons";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon = "info", 
  action, 
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-neutral-surface border border-neutral-border border-dashed rounded-3xl ${className}`}>
      <div className="w-16 h-16 bg-neutral-background rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Icon name={icon} size="lg" className="text-neutral-muted" />
      </div>
      <h3 className="text-xl font-bold text-neutral-text mb-2">
        {title}
      </h3>
      <p className="text-neutral-text/70 max-w-sm mx-auto mb-8">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
