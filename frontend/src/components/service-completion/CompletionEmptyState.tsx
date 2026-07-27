import { ReactNode } from "react";

interface CompletionEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function CompletionEmptyState({ title, description, icon }: CompletionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-neutral-surface/50 border border-neutral-border border-dashed rounded-lg">
      {icon ? (
        <div className="w-12 h-12 rounded-full bg-neutral-border text-neutral-dark flex items-center justify-center mb-4">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-neutral-border text-neutral-dark flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-neutral-dark mb-1">{title}</h3>
      <p className="text-sm text-neutral-text max-w-sm">{description}</p>
    </div>
  );
}
