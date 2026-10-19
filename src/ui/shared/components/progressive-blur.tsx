"use client";

import { cn } from "cn";

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const;

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
};

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);

  return (
    <div className={cn("pointer-events-none", className)}>
      {Array.from({ length: layers }, (_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const start = (index / layers) * 45;
        const end = Math.min(100, start + 55);
        const gradient = `linear-gradient(${angle}deg, transparent ${start}%, black ${end}%)`;

        return (
          <div
            key={index}
            className="absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${(index + 1) * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${(index + 1) * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
