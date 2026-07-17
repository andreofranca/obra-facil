import { Button } from "@/components/ui";
import { colors, radius, shadows, spacing, typography } from "@/design-system";

export function CTA() {
  return (
    <section aria-labelledby="cta-title" style={{ paddingBlock: spacing[16] }}>
      <div
        style={{
          alignItems: "center",
          background: colors.brand.primary,
          borderRadius: radius.lg,
          boxShadow: shadows.md,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: `${spacing[16]} ${spacing[6]}`,
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            border: `${spacing[2]} solid ${colors.brand.accent}`,
            borderRadius: radius.full,
            height: spacing[18],
            opacity: 0.8,
            position: "absolute",
            right: spacing[8],
            top: `-${spacing[6]}`,
            width: spacing[18],
          }}
        />
        <div style={{ maxWidth: "720px", position: "relative" }}>
          <h2
            id="cta-title"
            style={{
              color: colors.neutral.white,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize["3xl"],
              fontWeight: typography.fontWeight.bold,
              lineHeight: typography.lineHeight.tight,
              margin: spacing[0],
            }}
          >
            Pronto para encontrar o profissional ideal?
          </h2>
          <p
            style={{
              color: colors.neutral.white,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.lg,
              lineHeight: typography.lineHeight.relaxed,
              margin: `${spacing[4]} ${spacing[0]} ${spacing[8]}`,
              opacity: 0.88,
            }}
          >
            Solicite gratuitamente um serviço ou faça parte da nossa rede de
            profissionais.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacing[3],
              justifyContent: "center",
            }}
          >
            <Button
              size="lg"
              style={{
                background: colors.neutral.white,
                borderColor: colors.neutral.white,
                color: colors.brand.primary,
              }}
            >
              Solicitar Serviço
            </Button>
            <Button
              size="lg"
              variant="outline"
              style={{
                background: "transparent",
                borderColor: colors.neutral.white,
                color: colors.neutral.white,
              }}
            >
              Cadastrar como Profissional
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
