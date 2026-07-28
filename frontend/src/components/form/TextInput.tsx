import React, { forwardRef } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";

export const TextInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    return <BaseInput ref={ref} type="text" {...props} />;
  }
);

TextInput.displayName = "TextInput";
