import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`
        bg-neutral-surface border border-solid border-neutral-border
        rounded-lg shadow-sm p-4
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {children}
    </div>
  );
}
