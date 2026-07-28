import React from "react";
import { Icon } from "@/platform/icons";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-background/70 backdrop-blur-sm transition-opacity duration-300"
      aria-busy="true"
      aria-live="polite"
      role="progressbar"
    >
      <Icon name="check" className="animate-spin text-brand-primary mb-4" size="xl" />
      {/* We need a proper spinner icon. Let's use 'check' for now, but in reality we should add a spinner or just use SVG */}
      <div className="w-12 h-12 border-4 border-neutral-border border-t-brand-primary rounded-full animate-spin mb-4" />
      
      {message && (
        <p className="text-neutral-text font-medium text-lg animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
