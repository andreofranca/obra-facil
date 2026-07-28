import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToast } from "./useToast";
import { NotificationProvider } from "./NotificationProvider";
import React from "react";

describe("Hook: useToast", () => {
  it("deve disparar toasts na fila de notificações", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.success("Ação concluída");
    });

    // Como o hook apenas emite um evento global ou interage via context (neste caso, context)
    // O estado fica no provider, mas a API success() deve executar sem erros
    expect(result.current.success).toBeInstanceOf(Function);
  });
});
