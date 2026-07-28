import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { formatPhone } from "../../lib/format/phone";

export const PhoneInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatPhone(e.target.value);
      if (onChange) onChange(e);
    };

    return <BaseInput ref={ref} type="tel" onChange={handleChange} maxLength={15} {...props} />;
  }
);

PhoneInput.displayName = "PhoneInput";
