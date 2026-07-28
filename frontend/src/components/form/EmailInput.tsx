import React, { forwardRef, useState } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { normalizeEmail } from "../../lib/validation/email";

export interface EmailInputProps extends BaseInputProps {
  onCheckAvailability?: (email: string) => Promise<boolean>;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ onChange, onBlur, onCheckAvailability, ...props }, ref) => {
    const [isChecking, setIsChecking] = useState(false);
    const [availabilityError, setAvailabilityError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = normalizeEmail(e.target.value);
      setAvailabilityError("");
      if (onChange) onChange(e);
    };

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(e);
      if (onCheckAvailability && e.target.value) {
        setIsChecking(true);
        const isAvailable = await onCheckAvailability(e.target.value);
        setIsChecking(false);
        if (!isAvailable) {
          setAvailabilityError("Este e-mail já está em uso.");
        }
      }
    };

    return (
      <BaseInput
        ref={ref}
        type="email"
        onChange={handleChange}
        onBlur={handleBlur}
        isLoading={isChecking || props.isLoading}
        error={availabilityError || props.error}
        {...props}
      />
    );
  }
);

EmailInput.displayName = "EmailInput";
