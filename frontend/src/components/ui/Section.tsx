import type { HTMLAttributes, ReactNode } from "react";
import { colors, spacing } from "@/design-system";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Section({
  children,
  tone = "default",
  style,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      style={{
        background:
          tone === "muted" ? colors.neutral.background : colors.neutral.white,
        paddingBlock: spacing[12],
        ...style,
      }}
    >
      {children}
    </section>
  );
}
