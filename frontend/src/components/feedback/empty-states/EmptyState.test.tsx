import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "./EmptyState";
import { axe } from "jest-axe";

describe("Component: EmptyState", () => {
  it("deve renderizar o título e a descrição", () => {
    render(
      <EmptyState 
        title="Nenhum dado" 
        description="Não há dados para exibir no momento." 
      />
    );
    
    expect(screen.getByText("Nenhum dado")).toBeInTheDocument();
    expect(screen.getByText("Não há dados para exibir no momento.")).toBeInTheDocument();
  });

  it("deve renderizar uma ação quando providenciada", () => {
    render(
      <EmptyState 
        title="Erro" 
        description="Falha de conexão" 
        action={<button>Tentar novamente</button>}
      />
    );
    
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  });

  it("não deve apresentar violações de acessibilidade", async () => {
    const { container } = render(
      <EmptyState title="Vazio" description="Lista vazia" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
