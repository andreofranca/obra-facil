import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { formatCEP } from "../../lib/format/cep";
import { ViaCepService } from "../../lib/services/ViaCepService";
import { Address } from "../../types/address";

export interface CepInputProps extends BaseInputProps {
  onCepFetched?: (data: Address) => void;
  onCepError?: () => void;
}

export const CepInput = forwardRef<HTMLInputElement, CepInputProps>(
  ({ onChange, onCepFetched, onCepError, ...props }, ref) => {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCEP(e.target.value);
      e.target.value = formatted;
      if (onChange) onChange(e);

      if (formatted.length === 9) {
        // Automatically fetch CEP
        const data = await ViaCepService.getAddress(formatted);
        if (data && onCepFetched) {
          onCepFetched({
            cep: data.cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          });
        } else if (!data && onCepError) {
          onCepError();
        }
      }
    };

    return <BaseInput ref={ref} type="text" onChange={handleChange} maxLength={9} {...props} />;
  }
);

CepInput.displayName = "CepInput";
