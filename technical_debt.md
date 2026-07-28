# Débito Técnico

Durante a implementação do EPIC 0 (Hardening, Etapa 1), identificamos alguns pontos de melhoria na base de código existente, apontados pelo `eslint`:

## 1. Tipagens `any` Existentes (TypeScript)
Vários arquivos da arquitetura antiga estão utilizando `any` de forma indiscriminada. É altamente recomendável tipar essas interfaces.
- `src/components/home/FeaturedProfessionals.tsx` (linhas 37)
- `src/components/reviews/ReviewForm.tsx` (linha 44)
- `src/components/reviews/ReviewList.tsx` (linha 5)
- `src/lib/services/profissionais.ts` (linhas 111 a 138)

## 2. Entidades HTML não Escapadas
- `src/components/reviews/ReviewCard.tsx` possui aspas não escapadas (usar `&quot;`).

## 3. Variáveis Não Utilizadas
- `src/lib/auth/guards.test.ts`: `requireSolicitationOwnership` definida mas não utilizada.
- `src/lib/auth/session.test.ts`: `vi` definida mas não utilizada.
- `tests/integration/categorias/getCategorias.test.ts`: `NextRequest` definido mas não utilizado.

Nenhum destes pontos foi refatorado automaticamente para não interferir na regra de negócio atual, conforme exigido nas diretrizes.
