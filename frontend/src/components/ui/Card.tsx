import type { HTMLAttributes, ReactNode } from "react";
import { colors, radius, shadows, spacing } from "@/design-system";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div
      {...props}
      style={{
        background: colors.neutral.surface,
        border: `1px solid ${colors.neutral.border}`,
        borderRadius: radius.lg,
        boxShadow: shadows.sm,
        padding: spacing[4],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
