import type { ReactNode } from "react";
import Link from "next/link";
import { Button, Container, Logo } from "@/components/ui";
import { colors, radius, shadows, spacing, typography } from "@/design-system";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

type NavbarUser = {
  name: string;
};

type NavbarProps = {
  user?: NavbarUser;
  onSignOut?: () => void;
  onMobileMenuClick?: () => void;
  userMenu?: ReactNode;
};

export function Navbar({
  user,
  onSignOut,
  onMobileMenuClick,
  userMenu,
}: NavbarProps) {
  const userArea = userMenu ?? (user ? <UserMenu {...user} onSignOut={onSignOut} /> : null);

  return (
    <header
      style={{
        background: colors.neutral.surface,
        borderBottom: `1px solid ${colors.neutral.border}`,
        boxShadow: shadows.sm,
      }}
    >
      <Container size="xl">
        <div
          style={{
            minHeight: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing[4],
          }}
        >
          <Link href="/" aria-label="ObraFácil - Início" style={{ textDecoration: "none" }}>
            <Logo compact />
          </Link>

          <NavLinks />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: spacing[3],
            }}
          >
            {userArea ?? (
              <>
                <Link
                  href="/login"
                  style={{
                    color: colors.brand.primary,
                    fontFamily: typography.fontFamily.sans,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    textDecoration: "none",
                  }}
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  style={{
                    alignItems: "center",
                    background: colors.brand.primary,
                    borderRadius: radius.lg,
                    color: colors.neutral.white,
                    display: "inline-flex",
                    fontFamily: typography.fontFamily.sans,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    justifyContent: "center",
                    minHeight: "36px",
                    padding: `${spacing[2]} ${spacing[3]}`,
                    textDecoration: "none",
                  }}
                >
                  Cadastrar
                </Link>
              </>
            )}
            <Button
              aria-label="Abrir menu de navegação"
              aria-haspopup="menu"
              variant="outline"
              size="sm"
              onClick={onMobileMenuClick}
              style={{ paddingInline: spacing[2] }}
            >
              Menu
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
