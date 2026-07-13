import type { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/design-system";
import { Container, Section } from "@/components/ui";
import { ThemeProvider } from "@/theme";

type AppLayoutProps = {
  children: ReactNode;
  contentSize?: "md" | "lg" | "xl";
  style?: CSSProperties;
};

export function AppLayout({
  children,
  contentSize = "lg",
  style,
}: AppLayoutProps) {
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
            paddingBlock: spacing[8],
          }}
        >
          <Container size={contentSize}>{children}</Container>
        </Section>
      </main>
    </ThemeProvider>
  );
}
