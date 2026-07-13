import type { CSSProperties, InputHTMLAttributes } from "react";
import { colors, radius, shadows, spacing, typography } from "@/design-system";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "44px",
  border: `1px solid ${colors.neutral.border}`,
  borderRadius: radius.lg,
  background: colors.neutral.white,
  color: colors.neutral.text,
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.md,
  lineHeight: typography.lineHeight.normal,
  padding: `${spacing[2]} ${spacing[3]}`,
  outline: "none",
  boxShadow: shadows.none,
};

export function Input({
  label,
  error,
  helperText,
  id,
  style,
  ...props
}: InputProps) {
  const helperId = id ? `${id}-helper` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  return (
    <label
      style={{
        display: "grid",
        gap: spacing[2],
        color: colors.neutral.text,
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
      }}
    >
      {label}
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperId}
        style={{
          ...inputStyle,
          borderColor: error ? colors.feedback.error : colors.neutral.border,
          boxShadow: error ? "none" : undefined,
          ...style,
        }}
      />
      {error ? (
        <span
          id={errorId}
          style={{
            color: colors.feedback.error,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.regular,
          }}
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          id={helperId}
          style={{
            color: colors.neutral.muted,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.regular,
          }}
        >
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
