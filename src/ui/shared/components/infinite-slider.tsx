"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn } from "cn";

export type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  const translation = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const currentSpeed = isHovering && speedOnHover ? speedOnHover : speed;

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: remainingDistance / currentSpeed,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
      return () => controls.stop();
    }

    const controls = animate(translation, [from, to], {
      ease: "linear",
      duration,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
      onRepeat: () => {
        translation.set(from);
      },
    });

    return () => controls.stop();
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setIsHovering(true);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setIsHovering(false);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        <div aria-hidden className="contents">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
