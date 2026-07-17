"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { colors, radius, shadows, spacing, typography } from "@/design-system";

const professionals = [
  {
    initials: "CS",
    name: "Carlos Silva",
    specialty: "Pedreiro",
    location: "Rio de Janeiro/RJ",
    reviews: "124 avaliações",
    description: "Especialista em reformas residenciais e acabamentos de qualidade.",
  },
  {
    initials: "AS",
    name: "Ana Souza",
    specialty: "Eletricista",
    location: "São Paulo/SP",
    reviews: "98 avaliações",
    description: "Instalações elétricas seguras para residências e comércios.",
  },
  {
    initials: "JO",
    name: "João Oliveira",
    specialty: "Encanador",
    location: "Belo Horizonte/MG",
    reviews: "76 avaliações",
    description: "Soluções ágeis para instalações, reparos e vazamentos.",
  },
  {
    initials: "MC",
    name: "Mariana Costa",
    specialty: "Pintora",
    location: "Curitiba/PR",
    reviews: "112 avaliações",
    description: "Pintura cuidadosa para renovar ambientes internos e externos.",
  },
] as const;

export function FeaturedProfessionals() {
  const [activeProfessional, setActiveProfessional] = useState<string | null>(null);

  return (
    <section aria-labelledby="featured-professionals-title" style={{ paddingBlock: spacing[16] }}>
      <div style={{ marginBottom: spacing[8], maxWidth: "560px" }}>
        <h2
          id="featured-professionals-title"
          style={{
            color: colors.neutral.text,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            margin: spacing[0],
          }}
        >
          Profissionais em Destaque
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
          Conheça alguns profissionais disponíveis na plataforma.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: spacing[4],
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {professionals.map((professional) => {
          const isActive = activeProfessional === professional.name;

          return (
            <Card
              key={professional.name}
              onBlur={() => setActiveProfessional(null)}
              onFocus={() => setActiveProfessional(professional.name)}
              onMouseEnter={() => setActiveProfessional(professional.name)}
              onMouseLeave={() => setActiveProfessional(null)}
              tabIndex={0}
              style={{
                background: isActive ? colors.neutral.background : colors.neutral.surface,
                borderColor: isActive ? colors.brand.primary : colors.neutral.border,
                boxShadow: isActive ? shadows.md : shadows.sm,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: spacing[4],
                minHeight: "344px",
                transition: "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
              }}
            >
              <div style={{ alignItems: "center", display: "flex", gap: spacing[3] }}>
                <div
                  aria-hidden="true"
                  style={{
                    alignItems: "center",
                    background: colors.brand.primary,
                    borderRadius: radius.full,
                    color: colors.neutral.white,
                    display: "flex",
                    flex: "0 0 auto",
                    fontFamily: typography.fontFamily.sans,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    height: spacing[12],
                    justifyContent: "center",
                    width: spacing[12],
                  }}
                >
                  {professional.initials}
                </div>
                <div>
                  <h3
                    style={{
                      color: colors.neutral.text,
                      fontFamily: typography.fontFamily.sans,
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.semibold,
                      lineHeight: typography.lineHeight.tight,
                      margin: spacing[0],
                    }}
                  >
                    {professional.name}
                  </h3>
                  <p
                    style={{
                      color: colors.brand.primary,
                      fontFamily: typography.fontFamily.sans,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      lineHeight: typography.lineHeight.normal,
                      margin: `${spacing[1]} ${spacing[0]} ${spacing[0]}`,
                    }}
                  >
                    {professional.specialty}
                  </p>
                </div>
              </div>

              <p
                style={{
                  color: colors.neutral.muted,
                  fontFamily: typography.fontFamily.sans,
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.normal,
                  margin: spacing[0],
                }}
              >
                {professional.location}
              </p>

              <div style={{ alignItems: "center", display: "flex", gap: spacing[2] }}>
                <span
                  aria-label="Avaliação de cinco estrelas"
                  style={{
                    color: colors.brand.accent,
                    fontSize: typography.fontSize.md,
                    letterSpacing: "0.04em",
                    lineHeight: typography.lineHeight.tight,
                  }}
                >
                  ★★★★★
                </span>
                <span
                  style={{
                    color: colors.neutral.muted,
                    fontFamily: typography.fontFamily.sans,
                    fontSize: typography.fontSize.xs,
                    lineHeight: typography.lineHeight.normal,
                  }}
                >
                  {professional.reviews}
                </span>
              </div>

              <p
                style={{
                  color: colors.neutral.muted,
                  fontFamily: typography.fontFamily.sans,
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.normal,
                  margin: spacing[0],
                }}
              >
                {professional.description}
              </p>

              <div style={{ marginTop: "auto" }}>
                <Button disabled size="sm" style={{ width: "100%" }}>
                  Ver Perfil
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
