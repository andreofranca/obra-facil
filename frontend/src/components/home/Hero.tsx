import { Button, Input, Logo } from "@/components/ui";
import { colors, radius, shadows, spacing, typography } from "@/design-system";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        gap: spacing[12],
        justifyContent: "space-between",
        minHeight: "calc(100vh - 128px)",
        paddingBlock: spacing[18],
      }}
    >
      <div style={{ flex: "1 1 440px", maxWidth: "600px" }}>
        <Logo />
        <h1
          id="hero-title"
          style={{
            color: colors.neutral.text,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize["4xl"],
            fontWeight: typography.fontWeight.bold,
            letterSpacing: "-0.02em",
            lineHeight: typography.lineHeight.tight,
            margin: `${spacing[6]} ${spacing[0]} ${spacing[4]}`,
          }}
        >
          Encontre profissionais de confiança para sua obra.
        </h1>
        <p
          style={{
            color: colors.neutral.muted,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.lg,
            lineHeight: typography.lineHeight.relaxed,
            margin: spacing[0],
            maxWidth: "560px",
          }}
        >
          Solicite serviços, receba propostas e escolha o profissional ideal para sua
          necessidade.
        </p>

        <div
          role="search"
          style={{
            background: colors.neutral.white,
            border: `1px solid ${colors.neutral.border}`,
            borderRadius: radius.lg,
            boxShadow: shadows.sm,
            marginTop: spacing[8],
            padding: spacing[3],
          }}
        >
          <Input
            aria-label="Qual serviço você procura?"
            placeholder="Qual serviço você procura?"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacing[3],
            marginTop: spacing[4],
          }}
        >
          <Button size="lg">Solicitar Serviço</Button>
          <Button size="lg" variant="outline">
            Sou Profissional
          </Button>
        </div>
      </div>

      <div
        aria-label="Espaço reservado para futura ilustração"
        style={{
          alignItems: "center",
          background: colors.brand.primary,
          borderRadius: radius.lg,
          boxShadow: shadows.md,
          display: "flex",
          flex: "1 1 360px",
          justifyContent: "center",
          minHeight: "360px",
          overflow: "hidden",
          padding: spacing[8],
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            background: colors.brand.accent,
            borderRadius: radius.full,
            height: spacing[18],
            opacity: 0.9,
            position: "absolute",
            right: spacing[8],
            top: spacing[8],
            width: spacing[18],
          }}
        />
        <div
          style={{
            background: colors.neutral.white,
            borderRadius: radius.lg,
            maxWidth: "320px",
            padding: spacing[8],
            position: "relative",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              color: colors.brand.primary,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              lineHeight: typography.lineHeight.tight,
              margin: spacing[0],
            }}
          >
            Sua obra começa aqui.
          </p>
          <p
            style={{
              color: colors.neutral.muted,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.sm,
              lineHeight: typography.lineHeight.normal,
              margin: `${spacing[3]} ${spacing[0]} ${spacing[0]}`,
            }}
          >
            Espaço reservado para futura ilustração.
          </p>
        </div>
      </div>
    </section>
  );
}
