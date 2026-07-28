import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  maxLengthIndicator?: boolean;
  currentLength?: number;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      error,
      helperText,
      isLoading,
      leftIcon,
      rightIcon,
      maxLengthIndicator,
      currentLength = 0,
      maxLength,
      className = "",
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const helperId = id ? `${id}-helper` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="grid gap-2 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-neutral-text font-sans text-sm font-medium flex justify-between"
          >
            <span>
              {label} {required && <span className="text-feedback-error">*</span>}
            </span>
            {maxLengthIndicator && maxLength && (
              <span className="text-xs text-neutral-muted">
                {currentLength}/{maxLength}
              </span>
            )}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center justify-center text-neutral-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            {...props}
            ref={ref}
            id={id}
            maxLength={maxLength}
            disabled={disabled || isLoading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperId}
            className={`
              w-full min-h-11 border border-solid rounded-lg bg-neutral-white text-neutral-text
              font-sans text-base leading-normal py-2 outline-none shadow-none
              transition-colors duration-150 ease-out
              focus:border-brand-primary focus:ring-1 focus:ring-brand-primary
              disabled:opacity-65 disabled:bg-neutral-background disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : 'pl-3'}
              ${rightIcon || isLoading ? 'pr-10' : 'pr-3'}
              ${error ? 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error' : 'border-neutral-border'}
              ${className}
            `.replace(/\s+/g, " ").trim()}
          />

          <div className="absolute right-3 flex items-center justify-center text-neutral-muted">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : rightIcon}
          </div>
        </div>

        {error ? (
          <span id={errorId} className="text-feedback-error text-sm font-normal">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-neutral-muted text-sm font-normal">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";
