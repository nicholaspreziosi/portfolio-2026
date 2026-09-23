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
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, type Transition } from "motion/react";
import { cn } from "cn";

type AnimatedChildProps = {
  "data-id": string;
  "data-checked"?: "true" | "false";
  className?: string;
  children?: ReactNode;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
};

type AnimatedBackgroundProps = {
  children: ReactNode;
  value: string;
  className?: string;
  hoverClassName?: string;
  containerClassName?: string;
  transition?: Transition;
  enableHover?: boolean;
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
  hoverClassName,
  containerClassName,
  transition = defaultTransition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const running = useRef<Array<{ stop: () => void }>>([]);
  const placed = useRef(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const highlighted = enableHover && hoveredId ? hoveredId : value;

  const measure = useCallback(
    (immediate: boolean) => {
      const container = containerRef.current;
      const target = highlighted
        ? container?.querySelector<HTMLElement>(`[data-id="${highlighted}"]`)
        : null;

      if (!container || !target) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const next = {
        x: targetRect.left - containerRect.left,
        y: targetRect.top - containerRect.top,
        width: targetRect.width,
        height: targetRect.height,
      };
      const values = [
        [x, next.x],
        [y, next.y],
        [width, next.width],
        [height, next.height],
      ] as const;

      if (immediate && running.current.length > 0) return;

      running.current.forEach((playback) => playback.stop());
      running.current = [];

      if (immediate || !placed.current) {
        values.forEach(([motionValue, targetValue]) => motionValue.set(targetValue));
      } else {
        running.current = values.map(([motionValue, targetValue]) => {
          const playback = animate(motionValue, targetValue, transition);
          void playback.finished.finally(() => {
            running.current = running.current.filter((item) => item !== playback);
          });
          return playback;
        });
      }

      placed.current = true;
      setReady(true);
    },
    [height, highlighted, transition, width, x, y],
  );

  useLayoutEffect(() => {
    measure(false);
  }, [measure]);

  const measureRef = useRef(measure);
  measureRef.current = measure;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => measureRef.current(true));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center", containerClassName)}
      onMouseLeave={enableHover ? () => setHoveredId(null) : undefined}
    >
      {ready ? (
        <motion.div
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 left-0 transition-[filter] duration-200",
            hoveredId && hoverClassName ? hoverClassName : className,
          )}
          initial={false}
          style={{ x, y, width, height }}
        />
      ) : null}
      {Children.map(children, (child) => {
        if (!isValidElement<AnimatedChildProps>(child)) return child;

        const childId = child.props["data-id"];
        const active = highlighted === childId;

        return cloneElement(child as ReactElement<AnimatedChildProps>, {
          className: cn("relative z-10", child.props.className),
          "data-checked": active ? "true" : "false",
          onPointerEnter: (event: PointerEvent<HTMLElement>) => {
            child.props.onPointerEnter?.(event);
            if (enableHover && event.pointerType !== "touch") setHoveredId(childId);
          },
        });
      })}
    </div>
  );
}
