import React, { createContext, useState, ReactNode, useCallback } from "react";
import { LoadingOverlay } from "@/components/feedback/LoadingOverlay";

interface LoadingContextData {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextData | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const startLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => setMessage(undefined), 300); // Clear after animation
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, message, startLoading, stopLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}
