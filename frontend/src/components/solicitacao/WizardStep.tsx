import React from "react";

type WizardStepProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  isActive: boolean;
};

export function WizardStep({ title, description, children, isActive }: WizardStepProps) {
  if (!isActive) return null;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-text mb-2">{title}</h2>
        <p className="text-neutral-muted">{description}</p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
