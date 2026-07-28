import React, { forwardRef, useState } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { REGEX } from "../../lib/constants/regex";
import { LIMITS } from "../../lib/constants/limits";

export const PasswordInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ onChange, ...props }, ref) => {
    const [strength, setStrength] = useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      let score = 0;
      if (val.length >= LIMITS.PASSWORD_MIN) score += 1;
      if (REGEX.PASSWORD.UPPERCASE.test(val)) score += 1;
      if (REGEX.PASSWORD.LOWERCASE.test(val)) score += 1;
      if (REGEX.PASSWORD.NUMBER.test(val)) score += 1;
      if (REGEX.PASSWORD.SPECIAL.test(val)) score += 1;
      setStrength(score);

      if (onChange) onChange(e);
    };

    return (
      <div className="w-full flex flex-col gap-1">
        <BaseInput ref={ref} type="password" onChange={handleChange} {...props} />
        {/* Simple strength indicator */}
        <div className="flex gap-1 mt-1 h-1 w-full">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full ${
                strength >= level
                  ? level <= 2
                    ? "bg-feedback-error"
                    : level <= 4
                    ? "bg-feedback-warning"
                    : "bg-feedback-success"
                  : "bg-neutral-border"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
