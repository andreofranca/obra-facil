import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";
import { axe } from "jest-axe";

describe("Component: Button", () => {
  it("deve renderizar os children corretamente", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("deve disparar onClick ao clicar", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("deve renderizar estado de loading (aria-busy)", () => {
    render(<Button isLoading>Click me</Button>);
    
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("não deve apresentar violações de acessibilidade", async () => {
    const { container } = render(<Button>Acessível</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
