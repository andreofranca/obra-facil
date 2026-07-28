import React, { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLengthIndicator?: boolean;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
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
        
        <textarea
          {...props}
          ref={ref}
          id={id}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={`
            w-full min-h-[100px] border border-solid rounded-lg bg-neutral-white text-neutral-text
            font-sans text-base leading-normal px-3 py-2 outline-none shadow-none resize-y
            transition-colors duration-150 ease-out
            focus:border-brand-primary focus:ring-1 focus:ring-brand-primary
            disabled:opacity-65 disabled:bg-neutral-background disabled:cursor-not-allowed
            ${error ? 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error' : 'border-neutral-border'}
            ${className}
          `.replace(/\s+/g, " ").trim()}
        />

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

Textarea.displayName = "Textarea";
