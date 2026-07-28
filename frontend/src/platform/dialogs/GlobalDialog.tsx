import React, { useEffect, useRef } from "react";
import { DialogOptions } from "./DialogProvider";

interface GlobalDialogProps {
  isOpen: boolean;
  config: DialogOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function GlobalDialog({ isOpen, config, onConfirm, onCancel }: GlobalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && config?.type !== "alert") {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Focus o dialog para navegação de teclado básica
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel, config]);

  if (!isOpen && !config) return null;

  const isAlert = config?.type === "alert";
  const isDelete = config?.type === "delete";

  const confirmBtnClass = isDelete
    ? "bg-feedback-error hover:bg-feedback-error/90 text-white"
    : "bg-brand-primary hover:bg-brand-primary-dark text-white";

  return (
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      tabIndex={-1}
      ref={dialogRef}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-background/80 backdrop-blur-sm"
        onClick={() => !isAlert && onCancel()}
        aria-hidden="true"
      />

      {/* Dialog Body */}
      <div 
        className={`relative bg-neutral-surface rounded-2xl shadow-elevation-3 w-full max-w-md p-6 overflow-hidden transition-transform duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="mb-6">
          <h2 id="dialog-title" className="text-xl font-bold text-neutral-text mb-2">
            {config?.title}
          </h2>
          {config?.description && (
            <p id="dialog-description" className="text-neutral-text/80 text-sm">
              {config.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          {!isAlert && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium text-neutral-text hover:bg-neutral-background transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {config?.cancelText || "Cancelar"}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${confirmBtnClass}`}
            autoFocus
          >
            {config?.confirmText || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
