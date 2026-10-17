"use client";

import { type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
  type SpringOptions,
  type UseScrollOptions,
} from "motion/react";
import { cn } from "cn";

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLElement | null>;
  targetRef?: RefObject<HTMLElement | null>;
  progress?: MotionValue<number>;
  offset?: UseScrollOptions["offset"];
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
  progress,
  offset = ["start start", "end end"],
  orientation = "horizontal",
}: ScrollProgressProps) {
  if (progress) {
    return (
      <ProgressIndicator
        className={className}
        orientation={orientation}
        progress={progress}
        springOptions={springOptions}
      />
    );
  }

  return (
    <TargetScrollProgress
      className={className}
      containerRef={containerRef}
      offset={offset}
      orientation={orientation}
      springOptions={springOptions}
      targetRef={targetRef}
    />
  );
}

function TargetScrollProgress({
  className,
  springOptions,
  containerRef,
  targetRef,
  offset,
  orientation,
}: Omit<ScrollProgressProps, "progress">) {
  const { scrollYProgress } = useScroll(
    targetRef ? { target: targetRef, offset } : { container: containerRef }
  );

  return (
    <ProgressIndicator
      className={className}
      orientation={orientation}
      progress={scrollYProgress}
      springOptions={springOptions}
    />
  );
}

function ProgressIndicator({
  className,
  orientation = "horizontal",
  progress,
  springOptions,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  progress: MotionValue<number>;
  springOptions?: SpringOptions;
}) {
  const reduceMotion = useReducedMotion();
  const sprung = useSpring(progress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  });
  const scale = reduceMotion ? progress : sprung;
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
