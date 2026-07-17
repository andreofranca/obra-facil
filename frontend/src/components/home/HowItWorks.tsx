import { Card } from "@/components/ui";
import { colors, radius, spacing, typography } from "@/design-system";

const steps = [
  {
    emoji: "📝",
    title: "Solicite o serviço",
    description: "Informe o que precisa e publique sua solicitação.",
  },
  {
    emoji: "📨",
    title: "Receba propostas",
    description: "Profissionais interessados enviarão propostas.",
  },
  {
    emoji: "💬",
    title: "Converse",
    description: "Tire dúvidas e negocie diretamente pelo chat.",
  },
  {
    emoji: "🏆",
    title: "Escolha o profissional",
    description: "Compare propostas e contrate quem melhor atende à sua necessidade.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-it-works-title" style={{ paddingBlock: spacing[16] }}>
      <div style={{ marginBottom: spacing[8], maxWidth: "560px" }}>
        <h2
          id="how-it-works-title"
          style={{
            color: colors.neutral.text,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            margin: spacing[0],
          }}
        >
          Como funciona
        </h2>
        <p
          style={{
            color: colors.neutral.muted,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.md,
            lineHeight: typography.lineHeight.relaxed,
            margin: `${spacing[3]} ${spacing[0]} ${spacing[0]}`,
          }}
        >
          Solicite um serviço em poucos passos.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: spacing[4],
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {steps.map((step, index) => (
          <Card key={step.title} style={{ minHeight: "224px" }}>
            <div
              aria-hidden="true"
              style={{
                alignItems: "center",
                background: colors.brand.primary,
                borderRadius: radius.full,
                color: colors.neutral.white,
                display: "inline-flex",
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                height: spacing[8],
                justifyContent: "center",
                marginBottom: spacing[4],
                width: spacing[8],
              }}
            >
              {index + 1}
            </div>
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                fontSize: typography.fontSize["2xl"],
                lineHeight: typography.lineHeight.tight,
              }}
            >
              {step.emoji}
            </span>
            <h3
              style={{
                color: colors.neutral.text,
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                lineHeight: typography.lineHeight.tight,
                margin: `${spacing[4]} ${spacing[0]} ${spacing[2]}`,
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: colors.neutral.muted,
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.normal,
                margin: spacing[0],
              }}
            >
              {step.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
