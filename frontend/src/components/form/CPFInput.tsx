import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { formatCPF } from "../../lib/format/cpf";

export const CPFInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatCPF(e.target.value);
      if (onChange) onChange(e);
    };

    return <BaseInput ref={ref} type="text" onChange={handleChange} maxLength={14} {...props} />;
  }
);

CPFInput.displayName = "CPFInput";
