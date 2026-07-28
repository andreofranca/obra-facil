import React, { createContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastType } from "./Toast";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextData {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, message, duration };
    setMessages((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const contextValue: ToastContextData = {
    success: (msg, d) => addToast("success", msg, d),
    error: (msg, d) => addToast("error", msg, d),
    warning: (msg, d) => addToast("warning", msg, d),
    info: (msg, d) => addToast("info", msg, d),
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div 
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="pointer-events-auto">
            <Toast 
              type={msg.type} 
              message={msg.message} 
              onClose={() => removeToast(msg.id)} 
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
