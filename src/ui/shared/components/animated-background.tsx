"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "cn";

type AnimatedChildProps = {
  "data-id": string;
  "data-checked"?: "true" | "false";
  className?: string;
  children?: ReactNode;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
};

type AnimatedBackgroundProps = {
  children: ReactNode;
  value: string;
  className?: string;
  containerClassName?: string;
  transition?: Transition;
  enableHover?: boolean;
};

type HighlightBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const defaultTransition: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.5,
};

export function AnimatedBackground({
  children,
  value,
  className,
  containerClassName,
  transition = defaultTransition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [box, setBox] = useState<HighlightBox | null>(null);
  const highlighted = enableHover && hoveredId ? hoveredId : value;

  const measure = useCallback(() => {
    const container = containerRef.current;
    const target = highlighted
      ? container?.querySelector<HTMLElement>(`[data-id="${highlighted}"]`)
      : null;

    if (!container || !target) {
      setBox(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setBox({
      x: targetRect.left - containerRect.left,
      y: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height,
    });
  }, [highlighted]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center", containerClassName)}
      onMouseLeave={enableHover ? () => setHoveredId(null) : undefined}
    >
      {box ? (
        <motion.div
          aria-hidden
          className={cn("pointer-events-none absolute top-0 left-0", className)}
          initial={false}
          animate={box}
          transition={transition}
        />
      ) : null}
      {Children.map(children, (child) => {
        if (!isValidElement<AnimatedChildProps>(child)) return child;

        const childId = child.props["data-id"];
        const active = highlighted === childId;

        return cloneElement(child as ReactElement<AnimatedChildProps>, {
          className: cn("relative z-10", child.props.className),
          "data-checked": active ? "true" : "false",
          onMouseEnter: (event: MouseEvent<HTMLElement>) => {
            child.props.onMouseEnter?.(event);
            if (enableHover) setHoveredId(childId);
          },
        });
      })}
    </div>
  );
}
