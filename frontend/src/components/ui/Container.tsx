import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
};

const sizeClasses = {
  md: "max-w-[960px]",
  lg: "max-w-[1120px]",
  xl: "max-w-[1280px]",
} as const;

export function Container({
  children,
  size = "lg",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={`
        w-full mx-auto px-4
        ${sizeClasses[size]}
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {children}
    </div>
  );
}
