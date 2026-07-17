import Link from "next/link";
import { colors, spacing, typography } from "@/design-system";

const navigationItems = [
  { href: "/", label: "Início" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/#como-funciona", label: "Como Funciona" },
] as const;

type NavLinksProps = {
  onNavigate?: () => void;
};

export function NavLinks({ onNavigate }: NavLinksProps) {
  return (
    <nav aria-label="Navegação principal">
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing[6],
          listStyle: "none",
          margin: spacing[0],
          padding: spacing[0],
        }}
      >
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              style={{
                color: colors.neutral.text,
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                lineHeight: typography.lineHeight.normal,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
