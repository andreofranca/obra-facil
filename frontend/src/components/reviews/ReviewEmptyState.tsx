export function ReviewEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-neutral-surface/50 border border-neutral-border border-dashed rounded-lg">
      <div className="w-16 h-16 rounded-full bg-neutral-border/50 text-neutral-text flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-dark mb-1">Nenhuma avaliação ainda</h3>
      <p className="text-sm text-neutral-text max-w-sm">Este profissional ainda não recebeu avaliações. Seja o primeiro a avaliar após concluir um serviço!</p>
    </div>
  );
}
