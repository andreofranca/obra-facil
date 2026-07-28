import { useContext } from "react";
import { DialogContext } from "./DialogProvider";

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog deve ser usado dentro de um DialogProvider");
  }
  return context;
}
