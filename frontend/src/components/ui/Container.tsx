import type { HTMLAttributes, ReactNode } from "react";
import { spacing } from "@/design-system";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
};

const maxWidths = {
  md: "960px",
  lg: "1120px",
  xl: "1280px",
} as const;

export function Container({
  children,
  size = "lg",
  style,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      style={{
        width: "100%",
        maxWidth: maxWidths[size],
        marginInline: "auto",
        paddingInline: spacing[4],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
