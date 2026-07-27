export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center p-2 text-neutral-muted text-xs">
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-muted animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-muted animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-muted animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="ml-2">Digitando...</span>
    </div>
  );
}
