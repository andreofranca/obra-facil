import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Section({
  children,
  tone = "default",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={`
        py-12
        ${tone === "muted" ? 'bg-neutral-background' : 'bg-neutral-white'}
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {children}
    </section>
  );
}
