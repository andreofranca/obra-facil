import React, { useEffect, useState } from "react";
import { Icon } from "../icons";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const stylesMap: Record<ToastType, { bg: string, text: string, icon: "success-circle" | "error-circle" | "alert-triangle" | "info-circle" }> = {
  success: { bg: "bg-feedback-success", text: "text-white", icon: "success-circle" },
  error: { bg: "bg-feedback-error", text: "text-white", icon: "error-circle" },
  warning: { bg: "bg-feedback-warning", text: "text-neutral-background", icon: "alert-triangle" },
  info: { bg: "bg-feedback-info", text: "text-white", icon: "info-circle" },
};

export function Toast({ type, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Para triggar a animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { bg, text, icon } = stylesMap[type];

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-elevation-2 transition-all duration-300 transform 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} 
        ${bg} ${text}`}
      role="alert"
    >
      <Icon name={icon} size="md" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button 
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white rounded"
        aria-label="Fechar notificação"
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  );
}
