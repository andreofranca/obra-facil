# Typography

O sistema tipográfico utiliza as fontes nativas injetadas via Next.js (`next/font/google`), utilizando "Geist Sans" como fonte global do projeto para um visual geométrico e limpo.

## Escala de Headings

Os Headings utilizam a variável `--font-sans` com font-weight arrojado (`bold` ou `extrabold`).

- **Heading 1 (`text-5xl` / `text-6xl`):** Utilizado exclusivamente para o título principal da página (Hero). Peso: Extrabold. Tracking-tight.
- **Heading 2 (`text-3xl` / `text-4xl`):** Títulos de seções (CategoryGrid, FeaturedProfessionals). Peso: Bold.
- **Heading 3 (`text-xl` / `text-2xl`):** Títulos de cartões (Nomes de profissionais, Nomes de categorias). Peso: Bold.
- **Heading 4 (`text-lg`):** Sub-seções internas de blocos complexos.

## Escala de Corpo (Body)

- **Body Large (`text-lg`):** Textos descritivos importantes, subtítulos abaixo do H1 e H2.
- **Body (`text-base`):** O padrão textual da plataforma. Usado em descrições de cards, textos gerais, inputs.
- **Small (`text-sm`):** Metadados secundários, como navegação no footer, labels de ícones, avaliações, botões secundários.
- **Caption (`text-xs`):** Tags textuais, indicações miúdas, badges (ex: número de avaliações, status).

## Boas Práticas
- **Line Height (Leading):** Sempre mantenha H1 e H2 com leading `tight` (1 a 1.25). Textos longos devem usar leading `relaxed` (1.625) para melhor legibilidade.
