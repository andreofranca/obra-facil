"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface CompletionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isSubmitting?: boolean;
  icon?: ReactNode;
}

export function CompletionConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isSubmitting = false,
  icon
}: CompletionConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 text-center flex flex-col items-center">
          {icon && (
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
              {icon}
            </div>
          )}
          
          <h2 className="text-xl font-bold text-neutral-dark mb-2">{title}</h2>
          <p className="text-neutral-text text-sm mb-6">{description}</p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              variant="primary" 
              onClick={onConfirm} 
              disabled={isSubmitting}
              className="w-full justify-center"
            >
              {isSubmitting ? "Processando..." : confirmLabel}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="w-full justify-center"
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
