import { Address } from "../../types/address";

export function addressToLegacyString(address: Address | Partial<Address>): string {
  const parts = [
    address.logradouro,
    address.numero,
    address.complemento,
    address.bairro,
    (address.cidade && address.uf) ? `${address.cidade} - ${address.uf}` : (address.cidade || address.uf),
    address.cep
  ].filter(Boolean);
  
  return parts.join(", ");
}
