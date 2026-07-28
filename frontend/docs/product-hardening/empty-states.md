# Padronização de Empty States

O sistema agora utiliza sistematicamente o componente \`<EmptyState />\` localizado em \`src/components/feedback/empty-states/EmptyState.tsx\`.

Toda listagem que retorna vazia (como a busca sem resultados da Home ou uma tabela sem pedidos) deve implementá-lo:

\`\`\`tsx
import { EmptyState } from "@/components/feedback/empty-states/EmptyState";

{items.length === 0 ? (
  <EmptyState 
    title="Nenhum resultado"
    description="Não encontramos o que você procurava."
    icon="search"
  />
) : (
  <Lista />
)}
\`\`\`
