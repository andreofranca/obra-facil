import Link from "next/link";
import { Container, Logo } from "@/components/ui";
import { colors, spacing, typography } from "@/design-system";

const footerGroups = [
  {
    title: "Links",
    links: [
      { href: "/", label: "Início" },
      { href: "/profissionais", label: "Profissionais" },
      { href: "/#como-funciona", label: "Como funciona" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos-de-uso", label: "Termos de uso" },
      { href: "/politica-de-privacidade", label: "Política de privacidade" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer
      style={{
        background: colors.neutral.surface,
        borderTop: `${spacing[1]} solid ${colors.brand.accent}`,
      }}
    >
      <Container size="xl">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacing[8],
            justifyContent: "space-between",
            paddingBlock: spacing[12],
          }}
        >
          <div style={{ flex: "1 1 240px", maxWidth: "320px" }}>
            <Logo compact />
            <p
              style={{
                color: colors.neutral.muted,
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.relaxed,
                marginBlock: `${spacing[3]} ${spacing[0]}`,
              }}
            >
              Conectamos você aos profissionais certos para transformar sua obra.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} style={{ flex: "1 1 160px" }}>
              <h2
                style={{
                  color: colors.brand.primary,
                  fontFamily: typography.fontFamily.sans,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  lineHeight: typography.lineHeight.normal,
                  margin: spacing[0],
                }}
              >
                {group.title}
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                  listStyle: "none",
                  margin: `${spacing[3]} ${spacing[0]} ${spacing[0]}`,
                  padding: spacing[0],
                }}
              >
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: colors.neutral.muted,
                        fontFamily: typography.fontFamily.sans,
                        fontSize: typography.fontSize.sm,
                        lineHeight: typography.lineHeight.normal,
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${colors.neutral.border}`,
            paddingBlock: spacing[4],
          }}
        >
          <p
            style={{
              color: colors.neutral.muted,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.xs,
              lineHeight: typography.lineHeight.normal,
              margin: spacing[0],
            }}
          >
            © ObraFácil. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
