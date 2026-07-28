import { useContext } from "react";
import { ToastContext } from "./NotificationProvider";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um NotificationProvider");
  }
  return context;
}
