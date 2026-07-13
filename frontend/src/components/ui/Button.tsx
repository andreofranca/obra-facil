import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { colors, radius, shadows, spacing, typography } from "@/design-system";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: colors.brand.primary,
    borderColor: colors.brand.primary,
    color: colors.neutral.white,
  },
  secondary: {
    background: colors.brand.secondary,
    borderColor: colors.brand.secondary,
    color: colors.neutral.white,
  },
  outline: {
    background: colors.neutral.white,
    borderColor: colors.neutral.border,
    color: colors.neutral.text,
  },
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: colors.brand.primary,
  },
  danger: {
    background: colors.feedback.error,
    borderColor: colors.feedback.error,
    color: colors.neutral.white,
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    minHeight: "36px",
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
  },
  md: {
    minHeight: "44px",
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.md,
  },
  lg: {
    minHeight: "52px",
    padding: `${spacing[4]} ${spacing[6]}`,
    fontSize: typography.fontSize.md,
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  style,
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing[2],
        border: "1px solid",
        borderRadius: radius.lg,
        boxShadow: shadows.none,
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontFamily: typography.fontFamily.sans,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
        opacity: isDisabled ? 0.64 : 1,
        textDecoration: "none",
        transition: "background 160ms ease, border-color 160ms ease",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
