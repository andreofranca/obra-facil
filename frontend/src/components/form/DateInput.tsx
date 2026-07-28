import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { formatDate } from "../../lib/format/date";

export const DateInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatDate(e.target.value);
      if (onChange) onChange(e);
    };

    return <BaseInput ref={ref} type="text" onChange={handleChange} maxLength={10} placeholder="DD/MM/AAAA" {...props} />;
  }
);

DateInput.displayName = "DateInput";
