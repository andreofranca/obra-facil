import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { formatCurrency } from "../../lib/format/currency";

export const CurrencyInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatCurrency(e.target.value);
      if (onChange) onChange(e);
    };

    return <BaseInput ref={ref} type="text" onChange={handleChange} {...props} />;
  }
);

CurrencyInput.displayName = "CurrencyInput";
