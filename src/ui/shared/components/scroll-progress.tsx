"use client";

import { type RefObject } from "react";
import { motion, useScroll, type MotionValue, type UseScrollOptions } from "motion/react";
import { cn } from "cn";

export type ScrollProgressProps = {
  className?: string;
  containerRef?: RefObject<HTMLElement | null>;
  targetRef?: RefObject<HTMLElement | null>;
  progress?: MotionValue<number>;
  offset?: UseScrollOptions["offset"];
  orientation?: "horizontal" | "vertical";
};

export function ScrollProgress({
  className,
  containerRef,
  targetRef,
  progress,
  offset = ["start start", "end end"],
  orientation = "horizontal",
}: ScrollProgressProps) {
  if (progress) {
    return <ProgressIndicator className={className} orientation={orientation} progress={progress} />;
  }

  return (
    <TargetScrollProgress
      className={className}
      containerRef={containerRef}
      offset={offset}
      orientation={orientation}
      targetRef={targetRef}
    />
  );
}

function TargetScrollProgress({
  className,
  containerRef,
  targetRef,
  offset,
  orientation,
}: Omit<ScrollProgressProps, "progress">) {
  const { scrollYProgress } = useScroll(
    targetRef ? { target: targetRef, offset } : { container: containerRef }
  );

  return <ProgressIndicator className={className} orientation={orientation} progress={scrollYProgress} />;
}

function ProgressIndicator({
  className,
  orientation = "horizontal",
  progress,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  progress: MotionValue<number>;
}) {
  const vertical = orientation === "vertical";

  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute bg-foreground",
        vertical ? "inset-y-0 start-0 h-full w-px origin-top" : "inset-x-0 top-0 h-px w-full origin-left",
        className
      )}
      style={vertical ? { scaleY: progress } : { scaleX: progress }}
    />
  );
}
