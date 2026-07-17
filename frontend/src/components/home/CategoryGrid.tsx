"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { colors, shadows, spacing, typography } from "@/design-system";

const categories = [
  { emoji: "🧱", name: "Pedreiro", description: "Construção, reparos e acabamentos." },
  { emoji: "⚡", name: "Eletricista", description: "Instalações e reparos elétricos." },
  { emoji: "🔧", name: "Encanador", description: "Soluções para água e encanamentos." },
  { emoji: "🎨", name: "Pintor", description: "Pintura e renovação de ambientes." },
  { emoji: "🪚", name: "Marceneiro", description: "Móveis e projetos sob medida." },
  { emoji: "🌿", name: "Jardineiro", description: "Cuidados e projetos para jardins." },
  { emoji: "🏠", name: "Gesseiro", description: "Forros, divisórias e acabamentos." },
  { emoji: "🛠️", name: "Marido de Aluguel", description: "Pequenos reparos para o dia a dia." },
] as const;

export function CategoryGrid() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section aria-labelledby="categories-title" style={{ paddingBlock: spacing[16] }}>
      <div style={{ marginBottom: spacing[8], maxWidth: "560px" }}>
        <h2
          id="categories-title"
          style={{
            color: colors.neutral.text,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            margin: spacing[0],
          }}
        >
          Encontre o serviço ideal
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
          Selecione uma categoria e encontre profissionais especializados.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: spacing[4],
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.name;

          return (
            <Card
              key={category.name}
              onBlur={() => setActiveCategory(null)}
              onFocus={() => setActiveCategory(category.name)}
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
              tabIndex={0}
              style={{
                background: isActive ? colors.neutral.background : colors.neutral.surface,
                borderColor: isActive ? colors.brand.primary : colors.neutral.border,
                boxShadow: isActive ? shadows.md : shadows.sm,
                cursor: "pointer",
                minHeight: "168px",
                transition: "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  fontSize: typography.fontSize["2xl"],
                  lineHeight: typography.lineHeight.tight,
                }}
              >
                {category.emoji}
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
                {category.name}
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
                {category.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
