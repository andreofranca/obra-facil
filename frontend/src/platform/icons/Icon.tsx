import React from "react";
import { iconsMap, type IconName } from "./icons";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

export function Icon({ name, size = "md", className, ...props }: IconProps) {
  const IconComponent = iconsMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconsMap.`);
    return null;
  }

  const numericSize = typeof size === "number" ? size : sizeMap[size] || sizeMap.md;

  return <IconComponent size={numericSize} className={className} {...props} />;
}
