import React, { createContext, useState, ReactNode, useCallback } from "react";
import { GlobalDialog } from "./GlobalDialog";

export type DialogType = "confirm" | "alert" | "delete";

export interface DialogOptions {
  type?: DialogType;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface DialogContextData {
  confirm: (options: DialogOptions) => void;
  alert: (options: Omit<DialogOptions, "onCancel" | "cancelText" | "type">) => void;
  close: () => void;
}

export const DialogContext = createContext<DialogContextData | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogOptions | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setConfig(null), 300); // delay to let animation finish
  }, []);

  const confirm = useCallback((options: DialogOptions) => {
    setConfig({ type: "confirm", ...options });
    setIsOpen(true);
  }, []);

  const alert = useCallback((options: Omit<DialogOptions, "onCancel" | "cancelText" | "type">) => {
    setConfig({ ...options, type: "alert" });
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (config?.onConfirm) {
      await config.onConfirm();
    }
    close();
  }, [config, close]);

  const handleCancel = useCallback(() => {
    if (config?.onCancel) {
      config.onCancel();
    }
    close();
  }, [config, close]);

  const contextValue: DialogContextData = {
    confirm,
    alert,
    close,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <GlobalDialog
        isOpen={isOpen}
        config={config}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}
