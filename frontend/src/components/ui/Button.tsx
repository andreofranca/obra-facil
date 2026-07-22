import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary border-brand-primary text-neutral-white hover:opacity-90",
  secondary: "bg-brand-secondary border-brand-secondary text-neutral-white hover:opacity-90",
  outline: "bg-neutral-white border-neutral-border text-neutral-text hover:bg-neutral-background",
  ghost: "bg-transparent border-transparent text-brand-primary hover:bg-brand-primary/10",
  danger: "bg-feedback-error border-feedback-error text-neutral-white hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-3 text-base",
  lg: "min-h-[52px] px-6 py-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 border border-solid rounded-lg shadow-none
        font-sans font-semibold leading-tight no-underline
        transition-all duration-200 ease-out
        active:scale-[0.98] hover:shadow-sm
        disabled:opacity-65 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
        motion-reduce:transition-none motion-reduce:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
