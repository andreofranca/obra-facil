import { describe, it, expect } from "vitest";
import { addressToLegacyString } from "./address";

describe("Mapper: address", () => {
  it("deve mapear objeto de endereço completo para string legado", () => {
    const address = {
      cep: "01001-000",
      logradouro: "Praça da Sé",
      numero: "123",
      complemento: "Apto 1",
      bairro: "Sé",
      cidade: "São Paulo",
      uf: "SP"
    };
    
    expect(addressToLegacyString(address)).toBe("Praça da Sé, 123, Apto 1, Sé, São Paulo - SP, 01001-000");
  });

  it("deve mapear objeto parcial sem gerar vírgulas sobrando", () => {
    const address = {
      logradouro: "Rua X",
      numero: "10"
    };
    
    expect(addressToLegacyString(address)).toBe("Rua X, 10");
  });
});
