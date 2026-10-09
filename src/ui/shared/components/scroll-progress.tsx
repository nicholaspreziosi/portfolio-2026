"use client";

import { type RefObject } from "react";
import { motion, useScroll, useSpring, type SpringOptions } from "motion/react";
import { cn } from "cn";

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLElement | null>;
  targetRef?: RefObject<HTMLElement | null>;
  orientation?: "horizontal" | "vertical";
};

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
};

export function ScrollProgress({
  className,
  springOptions,
  containerRef,
  targetRef,
  orientation = "horizontal",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(
    targetRef
      ? { target: targetRef, offset: ["start start", "end end"] }
      : { container: containerRef }
  );

  const scale = useSpring(scrollYProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  });

  const vertical = orientation === "vertical";

  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute bg-foreground",
        vertical ? "inset-y-0 start-0 h-full w-px origin-top" : "inset-x-0 top-0 h-px w-full origin-left",
        className
      )}
      style={vertical ? { scaleY: scale } : { scaleX: scale }}
    />
  );
}
