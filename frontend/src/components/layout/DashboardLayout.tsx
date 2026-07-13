import type { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/design-system";
import { Container } from "@/components/ui";
import { ThemeProvider } from "@/theme";

type DashboardLayoutProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function DashboardLayout({ children, style }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <main
        style={{
          minHeight: "100vh",
          background: colors.neutral.background,
          color: colors.neutral.text,
          fontFamily: typography.fontFamily.sans,
          paddingBlock: spacing[6],
          ...style,
        }}
      >
        <Container
          size="xl"
          style={{
            display: "grid",
            gap: spacing[6],
          }}
        >
          {children}
        </Container>
      </main>
    </ThemeProvider>
  );
}
