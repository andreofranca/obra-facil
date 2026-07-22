import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const helperId = id ? `${id}-helper` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  return (
    <label className="grid gap-2 text-neutral-text font-sans text-sm font-medium">
      {label}
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperId}
        className={`
          w-full min-h-11 border border-solid rounded-lg bg-neutral-white text-neutral-text
          font-sans text-base leading-normal px-3 py-2 outline-none shadow-none
          transition-colors duration-150 ease-out
          focus:border-brand-primary focus:ring-1 focus:ring-brand-primary
          disabled:opacity-65 disabled:bg-neutral-background disabled:cursor-not-allowed
          ${error ? 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error' : 'border-neutral-border'}
          ${className}
        `.replace(/\s+/g, " ").trim()}
      />
      {error ? (
        <span
          id={errorId}
          className="text-feedback-error text-sm font-normal"
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          id={helperId}
          className="text-neutral-muted text-sm font-normal"
        >
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
