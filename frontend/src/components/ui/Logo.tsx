import type { HTMLAttributes } from "react";
import { colors, typography } from "@/design-system";

type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  compact?: boolean;
};

export function Logo({ compact = false, style, ...props }: LogoProps) {
  return (
    <span
      {...props}
      aria-label="ObraFácil"
      style={{
        color: colors.brand.primary,
        display: "inline-flex",
        fontFamily: typography.fontFamily.sans,
        fontSize: compact ? typography.fontSize.lg : typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: "0",
        lineHeight: typography.lineHeight.tight,
        ...style,
      }}
    >
      ObraFácil
    </span>
  );
}
