"use client";

import { useState } from "react";

interface RatingStarsProps {
  value: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function RatingStars({
  value,
  size = "md",
  interactive = false,
  onChange,
  className = "",
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) onChange(index);
  };

  const currentDisplayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= currentDisplayValue;
        
        return (
          <button
            key={index}
            type="button"
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } ${isFilled ? "text-yellow-400" : "text-neutral-border"}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            disabled={!interactive}
            aria-label={`${index} estrela${index > 1 ? "s" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
