import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "error" | "info";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-background text-neutral-text",
  success: "bg-[#EAF5EA] text-feedback-success",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  error: "bg-[#FDECEC] text-feedback-error",
  info: "bg-[#EAF1FF] text-feedback-info",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`
        inline-flex items-center rounded-full font-sans text-xs font-semibold leading-tight px-2 py-1 whitespace-nowrap
        ${toneClasses[tone]}
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {children}
    </span>
  );
}
