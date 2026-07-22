import type { HTMLAttributes } from "react";

type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  compact?: boolean;
};

export function Logo({ compact = false, className = "", ...props }: LogoProps) {
  return (
    <span
      {...props}
      aria-label="ObraFácil"
      className={`
        text-brand-primary inline-flex font-sans font-bold tracking-normal leading-tight
        ${compact ? 'text-lg' : 'text-2xl'}
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      ObraFácil
    </span>
  );
}
