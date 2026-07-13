import type { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/design-system";
import { Container, Section } from "@/components/ui";
import { ThemeProvider } from "@/theme";

type AuthLayoutProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function AuthLayout({ children, style }: AuthLayoutProps) {
  return (
    <ThemeProvider>
      <main
        style={{
          minHeight: "100vh",
          background: colors.neutral.background,
          color: colors.neutral.text,
          fontFamily: typography.fontFamily.sans,
          ...style,
        }}
      >
        <Section
          tone="muted"
          style={{
            minHeight: "100vh",
            display: "grid",
            alignItems: "center",
            paddingBlock: spacing[8],
          }}
        >
          <Container
            size="md"
            style={{
              display: "grid",
              justifyItems: "center",
            }}
          >
            {children}
          </Container>
        </Section>
      </main>
    </ThemeProvider>
  );
}
