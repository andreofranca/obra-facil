import type { HTMLAttributes, ReactNode } from "react";
import { colors, radius, spacing, typography } from "@/design-system";

type BadgeTone = "neutral" | "success" | "warning" | "error" | "info";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, { background: string; color: string }> = {
  neutral: {
    background: colors.neutral.background,
    color: colors.neutral.text,
  },
  success: {
    background: "#EAF5EA",
    color: colors.feedback.success,
  },
  warning: {
    background: "#FEF3C7",
    color: "#92400E",
  },
  error: {
    background: "#FDECEC",
    color: colors.feedback.error,
  },
  info: {
    background: "#EAF1FF",
    color: colors.feedback.info,
  },
};

export function Badge({
  children,
  tone = "neutral",
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: radius.full,
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
        padding: `${spacing[1]} ${spacing[2]}`,
        whiteSpace: "nowrap",
        ...toneStyles[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
