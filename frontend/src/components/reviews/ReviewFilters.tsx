export function ReviewFilters() {
  return (
    <div className="flex items-center gap-2 mb-6 opacity-50 cursor-not-allowed">
      <span className="text-sm font-medium text-neutral-dark">Filtrar por:</span>
      <select disabled className="px-3 py-1.5 text-sm border border-neutral-border rounded-md bg-neutral-surface">
        <option>Todas as estrelas</option>
        <option>5 estrelas</option>
        <option>4 estrelas</option>
      </select>
      <select disabled className="px-3 py-1.5 text-sm border border-neutral-border rounded-md bg-neutral-surface">
        <option>Mais recentes</option>
        <option>Maiores notas</option>
      </select>
    </div>
  );
}
